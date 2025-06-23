from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, case
from typing import List, Optional
from datetime import datetime

from database import get_db
from models import User, RebateRequest, MessBill, UserRole, RequestStatus
from schemas import (
    RebateRequest as RebateRequestSchema,
    RebateRequestUpdate,
    MessBillCreate,
    MessBill as MessBillSchema,
    RebateSummary,
)
from services.auth_service import get_current_user

router = APIRouter()

# Fixed admin email addresses – adjust as needed
FIXED_ADMIN_EMAILS = [
    "admin1@hall6.ac.in",
    "admin2@hall6.ac.in",
    "warden@hall6.ac.in",
    "mess.admin@hall6.ac.in",
    "sonalidubeycourseraeco@gmail.com"
]

def verify_admin(current_user: User = Depends(get_current_user)):
    """Ensure the caller is an admin."""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Admin privileges required.",
        )
    return current_user

@router.get("/students", response_model=List[dict])
async def get_students_with_rebate_summary(
    admin_user: User = Depends(verify_admin),
    db: Session = Depends(get_db),
):
    """
    List all students along with:
      - total_rebate_days (sum of total_days for APPROVED requests)
      - total_requests, pending/approved/rejected counts
      - approved_rebate_days (sum of total_days for APPROVED)
    """
    students_query = (
        db.query(
            User.id,
            User.name,
            User.email,
            User.roll_number,
            User.hostel,
            User.room_number,
            User.phone,
            User.is_active,
            User.created_at,
            func.coalesce(func.sum(RebateRequest.total_days), 0).label("total_rebate_days"),
            func.count(RebateRequest.id).label("total_requests"),
            func.sum(
                case(
                    [(RebateRequest.status == RequestStatus.APPROVED, RebateRequest.total_days)],
                    else_=0,
                )
            ).label("approved_rebate_days"),
            func.sum(
                case([(RebateRequest.status == RequestStatus.PENDING, 1)], else_=0)
            ).label("pending_requests"),
            func.sum(
                case([(RebateRequest.status == RequestStatus.APPROVED, 1)], else_=0)
            ).label("approved_requests"),
            func.sum(
                case([(RebateRequest.status == RequestStatus.REJECTED, 1)], else_=0)
            ).label("rejected_requests"),
        )
        .outerjoin(RebateRequest, RebateRequest.student_id == User.id)
        .filter(User.role == UserRole.STUDENT)
        .group_by(User.id)
        .all()
    )

    return [
        {
            "id": s.id,
            "name": s.name or "Not provided",
            "email": s.email,
            "roll_number": s.roll_number or "Not provided",
            "hostel": s.hostel or "Not provided",
            "room_number": s.room_number or "Not provided",
            "phone": s.phone or "Not provided",
            "is_active": s.is_active,
            "created_at": s.created_at,
            "rebate_summary": {
                "total_rebate_days": int(s.total_rebate_days or 0),
                "approved_rebate_days": int(s.approved_rebate_days or 0),
                "total_requests": int(s.total_requests or 0),
                "pending_requests": int(s.pending_requests or 0),
                "approved_requests": int(s.approved_requests or 0),
                "rejected_requests": int(s.rejected_requests or 0),
            },
        }
        for s in students_query
    ]

@router.get("/students/{student_id}/rebate-requests", response_model=dict)
async def get_student_rebate_requests(
    student_id: int,
    admin_user: User = Depends(verify_admin),
    db: Session = Depends(get_db),
):
    """All rebate requests for a particular student."""
    student = db.query(User).filter(User.id == student_id, User.role == UserRole.STUDENT).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")

    items = (
        db.query(RebateRequest)
        .filter(RebateRequest.student_id == student_id)
        .order_by(RebateRequest.created_at.desc())
        .all()
    )

    return {
        "student": {
            "id": student.id,
            "name": student.name,
            "roll_number": student.roll_number,
            "email": student.email,
        },
        "requests": [RebateRequestSchema.from_orm(r) for r in items],
    }

@router.get("/rebate-requests", response_model=List[dict])
async def get_all_rebate_requests(
    status_filter: Optional[str] = None,
    admin_user: User = Depends(verify_admin),
    db: Session = Depends(get_db),
):
    """All rebate requests, optionally filtered by status."""
    query = db.query(RebateRequest).join(User, RebateRequest.student_id == User.id)

    if status_filter:
        try:
            enum_status = RequestStatus(status_filter.lower())
            query = query.filter(RebateRequest.status == enum_status)
        except ValueError:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid status filter")

    items = query.order_by(RebateRequest.created_at.desc()).all()

    formatted = []
    for req in items:
        student = db.query(User).get(req.student_id)
        formatted.append({
            "id": req.id,
            "name": student.name if student else "Unknown",
            "roll_no": student.roll_number if student else "Unknown",
            "from_date": req.start_date.isoformat(),
            "to_date": req.end_date.isoformat(),
            "reason": req.reason,
            "status": req.status.value.title(),
            "submitted_on": req.created_at.strftime("%Y-%m-%d"),
            "document_url": req.document_path,
            "rejection_reason": req.admin_remarks if req.status == RequestStatus.REJECTED else None,
            "total_days": req.total_days,
            "student_id": req.student_id,
            "processed_at": req.processed_at.isoformat() if req.processed_at else None,
            "processed_by": req.processed_by,
        })
    return formatted

@router.put("/rebate-requests/{request_id}", response_model=RebateRequestSchema)
async def update_rebate_request(
    request_id: int,
    update_data: RebateRequestUpdate,
    admin_user: User = Depends(verify_admin),
    db: Session = Depends(get_db),
):
    """Generic update of a rebate request (approve/reject)."""
    rr = db.query(RebateRequest).get(request_id)
    if not rr:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rebate request not found")

    if update_data.status not in RequestStatus:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid status")

    rr.status = update_data.status
    if update_data.admin_remarks:
        rr.admin_remarks = update_data.admin_remarks
    rr.processed_by = admin_user.id
    rr.processed_at = datetime.utcnow()

    # ── **NEW**: if approving, bump student's total_rebate_days
    if update_data.status == RequestStatus.APPROVED:
        student = db.query(User).get(rr.student_id)
        student.total_rebate_days = (student.total_rebate_days or 0) + rr.total_days

    db.commit()
    db.refresh(rr)
    return RebateRequestSchema.from_orm(rr)

@router.post("/requests/{request_id}/approve")
async def approve_request(
    request_id: int,
    admin_user: User = Depends(verify_admin),
    db: Session = Depends(get_db),
):
    """Shortcut endpoint to approve a request."""
    rr = db.query(RebateRequest).get(request_id)
    if not rr:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rebate request not found")

    rr.status = RequestStatus.APPROVED
    rr.processed_by = admin_user.id
    rr.processed_at = datetime.utcnow()

    # ── **NEW**: bump total_rebate_days
    student = db.query(User).get(rr.student_id)
    student.total_rebate_days = (student.total_rebate_days or 0) + rr.total_days

    db.commit()
    return {"message": "Request approved successfully"}

@router.post("/requests/{request_id}/reject")
async def reject_request(
    request_id: int,
    rejection_data: dict,
    admin_user: User = Depends(verify_admin),
    db: Session = Depends(get_db),
):
    """Shortcut endpoint to reject a request with reason."""
    rr = db.query(RebateRequest).get(request_id)
    if not rr:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rebate request not found")

    rr.status = RequestStatus.REJECTED
    rr.admin_remarks = rejection_data.get("reason", "No reason provided")
    rr.processed_by = admin_user.id
    rr.processed_at = datetime.utcnow()

    db.commit()
    return {"message": "Request rejected successfully"}

@router.get("/requests", response_model=List[dict])
async def get_requests_for_dashboard(
    admin_user: User = Depends(verify_admin),
    db: Session = Depends(get_db),
):
    """Frontend-friendly list for admin dashboard."""
    return await get_all_rebate_requests(admin_user=admin_user, db=db)

@router.get("/dashboard-stats", response_model=dict)
async def get_dashboard_stats(
    admin_user: User = Depends(verify_admin),
    db: Session = Depends(get_db),
):
    """Counts for the admin dashboard cards."""
    total_students = db.query(User).filter(User.role == UserRole.STUDENT).count()
    pending = db.query(RebateRequest).filter(RebateRequest.status == RequestStatus.PENDING).count()
    approved = db.query(RebateRequest).filter(RebateRequest.status == RequestStatus.APPROVED).count()
    rejected = db.query(RebateRequest).filter(RebateRequest.status == RequestStatus.REJECTED).count()

    total_days = db.query(func.sum(RebateRequest.total_days))\
        .filter(RebateRequest.status == RequestStatus.APPROVED).scalar() or 0

    return {
        "total_students": total_students,
        "pending_requests": pending,
        "approved_requests": approved,
        "rejected_requests": rejected,
        "total_requests": pending + approved + rejected,
        "total_approved_rebate_days": int(total_days),
    }

@router.post("/mess-bills", response_model=MessBillSchema)
async def create_mess_bill(
    bill_data: MessBillCreate,
    admin_user: User = Depends(verify_admin),
    db: Session = Depends(get_db),
):
    """Create a new mess bill (admin only)."""
    student = db.query(User).filter(User.id == bill_data.student_id, User.role == UserRole.STUDENT).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")

    existing = db.query(MessBill).filter(
        MessBill.student_id == bill_data.student_id,
        MessBill.month == bill_data.month
    ).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Bill already exists for this month")

    mb = MessBill(**bill_data.dict())
    db.add(mb)
    db.commit()
    db.refresh(mb)
    return MessBillSchema.from_orm(mb)


@router.get("/students/list", response_model=List[dict])
async def get_basic_student_list(
    admin_user: User = Depends(verify_admin),
    db: Session = Depends(get_db),
):
    """
    Return list of all registered students with basic details
    """
    students = db.query(User).filter(User.role == UserRole.STUDENT).all()

    return [
        {
            "id": s.id,
            "name": s.name,
            "roll_number": s.roll_number,
            "email": s.email,
            "room_number": s.room_number,
            "phone": s.phone,
        }
        for s in students
    ]
