# backend/schemas.py
from pydantic import BaseModel, EmailStr
from datetime import datetime, date
from typing import Optional
from models import UserRole, RequestStatus

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    roll_number: Optional[str] = None
    name: Optional[str] = None
    phone: Optional[str] = None
    hostel: Optional[str] = None
    room_number: Optional[str] = None


class UserCreate(UserBase):
    pass

class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    hostel: Optional[str] = None
    room_number: Optional[str] = None

class User(UserBase):
    id: int
    role: UserRole
    is_active: bool
    is_verified: bool
    total_rebate_days: int
    created_at: datetime

    class Config:
        from_attributes = True

# Authentication Schemas
class LoginRequest(BaseModel):
    email: EmailStr
    roll_number: str

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    roll_number: str
    hostel: str
    room_number: str
    phone: str

class OTPVerifyRequest(BaseModel):
    email: EmailStr
    otp_code: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: User
    message: Optional[str] = None

class OTPResponse(BaseModel):
    message: str
    expires_in_minutes: int

class UserExistsResponse(BaseModel):
    exists: bool
    is_verified: bool

# Rebate Request Schemas
class RebateRequestBase(BaseModel):
    start_date: date
    end_date: date
    reason: str

class RebateRequestCreate(RebateRequestBase):
    pass

class RebateRequestUpdate(BaseModel):
    status: RequestStatus
    admin_remarks: Optional[str] = None

class RebateRequest(RebateRequestBase):
    id: int
    student_id: int
    total_days: int
    status: RequestStatus
    document_path: Optional[str] = None
    admin_remarks: Optional[str] = None
    processed_by: Optional[int] = None
    processed_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Mess Bill Schemas
class MessBillBase(BaseModel):
    month: str
    total_amount: float
    rebate_amount: float = 0.0
    final_amount: float

class MessBillCreate(MessBillBase):
    student_id: int

class MessBill(MessBillBase):
    id: int
    student_id: int
    is_paid: bool
    payment_date: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Summary Schema for frontend counts
class RebateSummary(BaseModel):
    total: int
    pending: int
    approved: int

    class Config:
        from_attributes = True

