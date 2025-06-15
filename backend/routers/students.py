from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Query
from sqlalchemy.orm import Session
from sqlalchemy import cast, String
from typing import List, Optional
import os
import uuid
from datetime import date

from database import get_db
from models import User, RebateRequest, MessBill, UserRole
from schemas import (
    RebateRequestCreate,
    RebateRequest as RebateRequestSchema,
    MessBill as MessBillSchema,
    RebateSummary,
    UserUpdate,
)
from services.auth_service import get_current_user


router = APIRouter(tags=["students"])

def calculate_days(start_date: date, end_date: date) -> int:
    """Calculate inclusive number of days between two dates."""
    return (end_date - start_date).days + 1

@router.get("/profile", response_model=dict)
async def get_profile(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.STUDENT:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Students only.")
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "roll_number": current_user.roll_number,
        "phone": current_user.phone,
        "hostel": current_user.hostel,
        "room_number": current_user.room_number,
        "total_rebate_days": current_user.total_rebate_days,
    }

@router.put("/profile", response_model=dict)
async def update_profile(
    profile_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role != UserRole.STUDENT:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Students only.")
    for field, value in profile_data.dict(exclude_unset=True).items():
        setattr(current_user, field, value)
    db.commit()
    return {"message": "Profile updated successfully"}

@router.post("/rebate-requests", response_model=RebateRequestSchema)
async def create_rebate_request(
    request_data: RebateRequestCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role != UserRole.STUDENT:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Students only.")
    if request_data.start_date > request_data.end_date:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Start date cannot be after end date.")
    total_days = calculate_days(request_data.start_date, request_data.end_date)
    if total_days > 30:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Maximum rebate period is 30 days.")
    rr = RebateRequest(
        student_id=current_user.id,
        start_date=request_data.start_date,
        end_date=request_data.end_date,
        total_days=total_days,
        reason=request_data.reason,
    )
    db.add(rr)
    db.commit()
    db.refresh(rr)
    return RebateRequestSchema.from_orm(rr)

@router.post("/rebate-requests/{request_id}/upload-document", response_model=dict)
async def upload_document(
    request_id: int,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role != UserRole.STUDENT:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Students only.")
    rr = db.query(RebateRequest).filter_by(id=request_id, student_id=current_user.id).first()
    if not rr:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rebate request not found.")
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in {".pdf", ".jpg", ".jpeg", ".png"}:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid file type.")
    upload_dir = "uploads/documents"
    os.makedirs(upload_dir, exist_ok=True)
    fname = f"{uuid.uuid4()}{ext}"
    path = os.path.join(upload_dir, fname)
    with open(path, "wb") as buf:
        buf.write(await file.read())
    rr.document_path = path
    db.commit()
    return {"message": "Uploaded successfully", "file_path": path}

@router.get("/rebate-requests", response_model=List[RebateRequestSchema])
async def get_rebate_requests(
    userId: Optional[int] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role == UserRole.STUDENT:
        target = current_user.id
    else:
        if userId is not None:
            target = userId
        else:
            items = db.query(RebateRequest).order_by(RebateRequest.created_at.desc()).all()
            return [RebateRequestSchema.from_orm(x) for x in items]

    items = (
        db.query(RebateRequest)
        .filter(RebateRequest.student_id == target)
        .order_by(RebateRequest.created_at.desc())
        .all()
    )
    return [RebateRequestSchema.from_orm(x) for x in items]

@router.get("/rebate-summary", response_model=RebateSummary)
async def get_rebate_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    base = db.query(RebateRequest).filter(RebateRequest.student_id == current_user.id)
    return RebateSummary(
        total=base.count(),
        pending=base.filter(cast(RebateRequest.status, String).ilike("pending")).count(),
        approved=base.filter(cast(RebateRequest.status, String).ilike("approved")).count(),
    )

@router.get("/mess-bills", response_model=List[MessBillSchema])
async def get_mess_bills(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role != UserRole.STUDENT:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Students only.")
    bills = (
        db.query(MessBill)
        .filter(MessBill.student_id == current_user.id)
        .order_by(MessBill.month.desc())
        .all()
    )
    return [MessBillSchema.from_orm(b) for b in bills]
