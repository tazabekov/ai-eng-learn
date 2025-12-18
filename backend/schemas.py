from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional
from datetime import datetime
from models import BookingStatus


# Tour Schemas
class TourBase(BaseModel):
    name: str = Field(min_length=1)
    description: str
    destination: str
    price: float = Field(gt=0)
    duration_days: int = Field(gt=0)
    image_url: Optional[str] = None
    available_seats: int = Field(ge=0)


class TourCreate(TourBase):
    pass


class TourRead(TourBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


# Client Schemas
class ClientBase(BaseModel):
    name: str
    email: EmailStr
    phone: str


class ClientCreate(ClientBase):
    pass


class ClientRead(ClientBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


# Booking Schemas
class BookingCreate(BaseModel):
    tour_id: int
    client_name: str
    client_email: EmailStr
    client_phone: str


class BookingStatusUpdate(BaseModel):
    status: BookingStatus


class BookingRead(BaseModel):
    id: int
    tour_id: int
    client_id: int
    booking_date: datetime
    status: BookingStatus
    total_price: float
    model_config = ConfigDict(from_attributes=True)


class BookingWithDetails(BookingRead):
    tour: Optional[TourRead] = None
    client: Optional[ClientRead] = None
