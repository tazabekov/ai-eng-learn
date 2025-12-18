from sqlmodel import Session, select
from typing import List, Optional
from models import Tour, Client, Booking, BookingStatus
from schemas import TourCreate, ClientCreate, BookingCreate
from fastapi import HTTPException, status


# Tour CRUD
def create_tour(session: Session, tour: TourCreate) -> Tour:
    db_tour = Tour.model_validate(tour)
    session.add(db_tour)
    session.commit()
    session.refresh(db_tour)
    return db_tour


def get_tour(session: Session, tour_id: int) -> Optional[Tour]:
    return session.get(Tour, tour_id)


def get_tours(session: Session, skip: int = 0, limit: int = 100) -> List[Tour]:
    statement = select(Tour).offset(skip).limit(limit)
    return list(session.exec(statement).all())


# Client CRUD
def get_or_create_client(session: Session, name: str, email: str, phone: str) -> Client:
    statement = select(Client).where(Client.email == email)
    client = session.exec(statement).first()

    if client:
        return client

    client = Client(name=name, email=email, phone=phone)
    session.add(client)
    session.commit()
    session.refresh(client)
    return client


def get_client(session: Session, client_id: int) -> Optional[Client]:
    return session.get(Client, client_id)


def get_clients(session: Session, skip: int = 0, limit: int = 100) -> List[Client]:
    statement = select(Client).offset(skip).limit(limit)
    return list(session.exec(statement).all())


def get_client_by_email(session: Session, email: str) -> Optional[Client]:
    statement = select(Client).where(Client.email == email)
    return session.exec(statement).first()


# Booking CRUD
def create_booking(session: Session, booking: BookingCreate) -> Booking:
    tour = session.get(Tour, booking.tour_id)
    if not tour:
        raise HTTPException(status_code=404, detail="Tour not found")

    if tour.available_seats <= 0:
        raise HTTPException(status_code=400, detail="No available seats")

    client = get_or_create_client(
        session,
        booking.client_name,
        booking.client_email,
        booking.client_phone
    )

    db_booking = Booking(
        tour_id=booking.tour_id,
        client_id=client.id,
        total_price=tour.price,
        status=BookingStatus.PENDING
    )

    tour.available_seats -= 1
    session.add(db_booking)
    session.add(tour)
    session.commit()
    session.refresh(db_booking)
    return db_booking


def get_booking(session: Session, booking_id: int) -> Optional[Booking]:
    return session.get(Booking, booking_id)


def get_bookings(session: Session, skip: int = 0, limit: int = 100) -> List[Booking]:
    statement = select(Booking).offset(skip).limit(limit)
    return list(session.exec(statement).all())


def get_bookings_by_client(session: Session, client_id: int) -> List[Booking]:
    statement = select(Booking).where(Booking.client_id == client_id)
    return list(session.exec(statement).all())


def get_bookings_by_email(session: Session, email: str) -> List[Booking]:
    client = get_client_by_email(session, email)
    if not client:
        return []
    return get_bookings_by_client(session, client.id)


def update_booking_status(session: Session, booking_id: int, new_status: BookingStatus) -> Booking:
    booking = session.get(Booking, booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    old_status = booking.status
    booking.status = new_status

    if new_status == BookingStatus.CANCELLED and old_status != BookingStatus.CANCELLED:
        tour = session.get(Tour, booking.tour_id)
        if tour:
            tour.available_seats += 1
            session.add(tour)

    session.add(booking)
    session.commit()
    session.refresh(booking)
    return booking
