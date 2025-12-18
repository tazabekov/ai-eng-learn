from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session
from typing import List
from database import get_session
from schemas import ClientRead, ClientCreate
import crud

router = APIRouter(prefix="/clients", tags=["clients"])


@router.get("/", response_model=List[ClientRead])
def get_clients(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    session: Session = Depends(get_session)
):
    return crud.get_clients(session, skip, limit)


@router.get("/{client_id}", response_model=ClientRead)
def get_client(client_id: int, session: Session = Depends(get_session)):
    client = crud.get_client(session, client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    return client
