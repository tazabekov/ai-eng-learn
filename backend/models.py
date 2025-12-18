from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime
from enum import Enum


class BookingStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"


class Tour(SQLModel, table=True):
    __tablename__ = "tours"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    description: str
    destination: str = Field(index=True)
    price: float = Field(gt=0)
    duration_days: int = Field(gt=0)
    image_url: Optional[str] = None
    available_seats: int = Field(ge=0)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    bookings: List["Booking"] = Relationship(back_populates="tour")


class Client(SQLModel, table=True):
    __tablename__ = "clients"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str = Field(unique=True, index=True)
    phone: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    bookings: List["Booking"] = Relationship(back_populates="client")


class Booking(SQLModel, table=True):
    __tablename__ = "bookings"

    id: Optional[int] = Field(default=None, primary_key=True)
    tour_id: int = Field(foreign_key="tours.id", index=True)
    client_id: int = Field(foreign_key="clients.id", index=True)
    booking_date: datetime = Field(default_factory=datetime.utcnow)
    status: BookingStatus = Field(default=BookingStatus.PENDING)
    total_price: float = Field(gt=0)

    tour: Optional[Tour] = Relationship(back_populates="bookings")
    client: Optional[Client] = Relationship(back_populates="bookings")
