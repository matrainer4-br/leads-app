from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

# Importações absolutas são mais seguras no Render
import app.models as models
import app.schemas as schemas
from app.database import engine, SessionLocal

# Cria as tabelas no banco de dados ao iniciar
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Gerenciador de Leads")

# Configuração de CORS para aceitar requisições do Lovable/Front-end
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, você pode trocar pelo domínio do seu site
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependência para abrir/fechar conexão com o banco
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"status": "Online", "message": "Backend de Leads operante!"}

@app.post("/leads", response_model=schemas.LeadResponse)
def create_lead(lead: schemas.LeadCreate, db: Session = Depends(get_db)):
    # .dict() foi depreciado no Pydantic V2, usando .model_dump() por segurança
    lead_data = lead.model_dump() if hasattr(lead, 'model_dump') else lead.dict()
    new_lead = models.Lead(**lead_data)
    db.add(new_lead)
    db.commit()
    db.refresh(new_lead)
    return new_lead

@app.get("/leads", response_model=list[schemas.LeadResponse])
def get_leads(db: Session = Depends(get_db)):
    return db.query(models.Lead).all()
