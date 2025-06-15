from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import random
import string

from database import get_db
from models import User, OTP, UserRole
from schemas import (
    LoginRequest,
    OTPVerifyRequest,
    Token,
    OTPResponse,
    User as UserSchema,
    RegisterRequest,
)
from services.email_service import send_otp_email
from services.auth_service import create_access_token, get_current_user
from config import settings

router = APIRouter()

def generate_otp(length: int = 6) -> str:
    """Generate a random numeric OTP."""
    return "".join(random.choices(string.digits, k=length))

# 🔧 FIXED LIST OF ADMIN EMAILS
FIXED_ADMIN_EMAILS = {
    "admin1@hall6.ac.in",
    "admin2@hall6.ac.in",
    "warden@hall6.ac.in",
    "mess.admin@hall6.ac.in",
    "sonalidubeycourseraeco@gmail.com",
}

@router.post("/register", response_model=OTPResponse)
async def register(register_data: RegisterRequest, db: Session = Depends(get_db)):
    """Register a new student and send OTP for verification."""
    existing_user = db.query(User).filter(
        (User.email == register_data.email) |
        (User.roll_number == register_data.roll_number)
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email or roll number already exists"
        )

    user = User(
        name=register_data.name,
        email=register_data.email,
        roll_number=register_data.roll_number,
        hostel=register_data.hostel,
        room_number=register_data.room_number,
        phone=register_data.phone,
        role=UserRole.STUDENT,
        is_verified=False
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    otp_code = generate_otp()
    expires_at = datetime.utcnow() + timedelta(minutes=settings.OTP_EXPIRE_MINUTES)
    otp = OTP(
        user_id=user.id,
        otp_code=otp_code,
        purpose="registration",
        expires_at=expires_at
    )
    db.add(otp)
    db.commit()

    send_otp_email(user.email, otp_code, purpose="registration")

    return OTPResponse(
        message="Registration successful! OTP sent to your email for verification.",
        expires_in_minutes=settings.OTP_EXPIRE_MINUTES
    )

@router.post("/login", response_model=OTPResponse)
async def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """
    Send OTP for login.
    • If email ∈ FIXED_ADMIN_EMAILS → ADMIN login (no roll_number).
      - Promote existing user or create one if missing.
    • Else → STUDENT login (requires roll_number & verified).
    """
    email = login_data.email.lower().strip()

    if email in FIXED_ADMIN_EMAILS:
        # 🔧 Admin path: lookup or promote/create
        user = db.query(User).filter(User.email == email).first()
        if user:
            if user.role != UserRole.ADMIN:
                user.role = UserRole.ADMIN
                user.is_verified = True
                db.commit()
                db.refresh(user)
        else:
            user = User(
                name="Admin",
                email=email,
                role=UserRole.ADMIN,
                is_verified=True
            )
            db.add(user)
            db.commit()
            db.refresh(user)
    else:
        # 🔧 Student path: require roll_number
        if not login_data.roll_number:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="roll_number is required for student login"
            )
        user = db.query(User).filter(
            User.email == email,
            User.roll_number == login_data.roll_number
        ).first()
        if not user or not user.is_verified:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student not found or not verified. Please register first."
            )

    # Generate & store OTP
    otp_code = generate_otp()
    expires_at = datetime.utcnow() + timedelta(minutes=settings.OTP_EXPIRE_MINUTES)
    otp = OTP(
        user_id=user.id,
        otp_code=otp_code,
        purpose="login",
        expires_at=expires_at
    )
    db.add(otp)
    db.commit()

    send_otp_email(user.email, otp_code, purpose="login")

    return OTPResponse(
        message="OTP sent to your email address",
        expires_in_minutes=settings.OTP_EXPIRE_MINUTES
    )

@router.post("/verify-otp", response_model=Token)
async def verify_otp(otp_data: OTPVerifyRequest, db: Session = Depends(get_db)):
    """Verify OTP and issue an access token."""
    user = db.query(User).filter(User.email == otp_data.email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    otp = db.query(OTP).filter(
        OTP.user_id == user.id,
        OTP.otp_code == otp_data.otp_code,
        OTP.is_used == False,
        OTP.expires_at > datetime.utcnow()
    ).first()
    if not otp:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired OTP")

    otp.is_used = True
    user.is_verified = True
    db.commit()

    access_token = create_access_token(data={"sub": user.email})
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=UserSchema.from_orm(user),
        message="Login successful!"
    )

@router.get("/me", response_model=UserSchema)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Return the currently authenticated user."""
    return UserSchema.from_orm(current_user)

@router.post("/logout")
async def logout():
    """Client-side should simply discard the token."""
    return {"message": "Successfully logged out"}

@router.post("/check-user")
async def check_user_exists(email: str, roll_number: str, db: Session = Depends(get_db)):
    """Check if a student exists and is verified."""
    user = db.query(User).filter(
        User.email == email,
        User.roll_number == roll_number
    ).first()
    return {
        "exists": user is not None,
        "is_verified": user.is_verified if user else False
    }
