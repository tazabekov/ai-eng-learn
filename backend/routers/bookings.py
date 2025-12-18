from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session
from typing import List
from database import get_session
from schemas import BookingRead, BookingCreate, BookingStatusUpdate, BookingWithDetails
import crud

router = APIRouter(prefix="/bookings", tags=["bookings"])


@router.post("/", response_model=BookingRead, status_code=201)
def create_booking(booking: BookingCreate, session: Session = Depends(get_session)):
    return crud.create_booking(session, booking)


@router.get("/", response_model=List[BookingWithDetails])
def get_bookings(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    session: Session = Depends(get_session)
):
    return crud.get_bookings(session, skip, limit)


@router.get("/client/{email}", response_model=List[BookingWithDetails])
def get_client_bookings(email: str, session: Session = Depends(get_session)):
    return crud.get_bookings_by_email(session, email)


@router.get("/{booking_id}", response_model=BookingWithDetails)
def get_booking(booking_id: int, session: Session = Depends(get_session)):
    booking = crud.get_booking(session, booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking


@router.patch("/{booking_id}/status", response_model=BookingRead)
def update_booking_status(
    booking_id: int,
    status_update: BookingStatusUpdate,
    session: Session = Depends(get_session)
):
    return crud.update_booking_status(session, booking_id, status_update.status)
