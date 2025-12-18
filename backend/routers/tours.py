from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session
from typing import List
from database import get_session
from schemas import TourRead, TourCreate
import crud

router = APIRouter(prefix="/tours", tags=["tours"])


@router.get("/", response_model=List[TourRead])
def get_tours(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    session: Session = Depends(get_session)
):
    return crud.get_tours(session, skip, limit)


@router.get("/{tour_id}", response_model=TourRead)
def get_tour(tour_id: int, session: Session = Depends(get_session)):
    tour = crud.get_tour(session, tour_id)
    if not tour:
        raise HTTPException(status_code=404, detail="Tour not found")
    return tour


@router.post("/", response_model=TourRead, status_code=201)
def create_tour(tour: TourCreate, session: Session = Depends(get_session)):
    return crud.create_tour(session, tour)
