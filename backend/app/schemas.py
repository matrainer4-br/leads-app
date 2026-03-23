from pydantic import BaseModel
from datetime import datetime

class LeadCreate(BaseModel):
    nome: str
    email: str
    telefone: str

class LeadResponse(LeadCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True