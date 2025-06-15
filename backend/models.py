from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey, Enum as SQLEnum, Numeric, Date
from database import Base  # ✅ use Base from database.py
from sqlalchemy.orm import relationship
from datetime import datetime, date
import enum

class UserRole(enum.Enum):
    STUDENT = "student"
    ADMIN = "admin"

class RequestStatus(enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    roll_number = Column(String(20), unique=True, index=True, nullable=True)
    email = Column(String(100), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=True)
    phone = Column(String(15), nullable=True)
    hostel = Column(String(50), nullable=True)
    room_number = Column(String(10), nullable=True)
    role = Column(SQLEnum(UserRole), default=UserRole.STUDENT)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    total_rebate_days = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships with explicit foreign_keys
    rebate_requests = relationship(
        "RebateRequest", 
        foreign_keys="RebateRequest.student_id",
        back_populates="student"
    )
    processed_requests = relationship(
        "RebateRequest", 
        foreign_keys="RebateRequest.processed_by",
        back_populates="processor"
    )
    otps = relationship("OTP", back_populates="user")
    mess_bills = relationship("MessBill", back_populates="student")

class OTP(Base):
    __tablename__ = "otps"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    otp_code = Column(String(10), nullable=False)
    purpose = Column(String(20), default="login")
    is_used = Column(Boolean, default=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="otps")

class RebateRequest(Base):
    __tablename__ = "rebate_requests"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    total_days = Column(Integer, nullable=False)
    reason = Column(Text, nullable=False)
    document_path = Column(String(255), nullable=True)
    status = Column(SQLEnum(RequestStatus), default=RequestStatus.PENDING)
    admin_remarks = Column(Text, nullable=True)
    processed_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    processed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships with explicit foreign_keys
    student = relationship(
        "User", 
        foreign_keys=[student_id], 
        back_populates="rebate_requests"
    )
    processor = relationship(
        "User", 
        foreign_keys=[processed_by], 
        back_populates="processed_requests"
    )

class MessBill(Base):
    __tablename__ = "mess_bills"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    month = Column(String(7), nullable=False)  # Format: YYYY-MM
    total_amount = Column(Numeric(10, 2), nullable=False)
    rebate_amount = Column(Numeric(10, 2), default=0.00)
    final_amount = Column(Numeric(10, 2), nullable=False)
    is_paid = Column(Boolean, default=False)
    payment_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    student = relationship("User", back_populates="mess_bills")
