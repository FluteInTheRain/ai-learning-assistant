
from fastapi import FastAPI, HTTPException
from fastapi.responses import RedirectResponse

from app.database import db
from app.models import ItemCreate, ItemResponse, ItemUpdate

app = FastAPI(title="Tiny FastAPI CRUD Baseline")


@app.get("/")
def root() -> RedirectResponse:
    return RedirectResponse(url="/docs")


@app.post("/items", response_model=ItemResponse)
def create_item(item_in: ItemCreate) -> ItemResponse:
    return db.create(item_in)


@app.get("/items", response_model=list[ItemResponse])
def read_items() -> list[ItemResponse]:
    return db.get_all()


@app.get("/items/{item_id}", response_model=ItemResponse)
def read_item(item_id: int) -> ItemResponse:
    item = db.get_by_id(item_id)
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


@app.put("/items/{item_id}", response_model=ItemResponse)
def update_item(item_id: int, item_in: ItemUpdate) -> ItemResponse:
    item = db.update(item_id, item_in)
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


@app.delete("/items/{item_id}", response_model=ItemResponse)
def delete_item(item_id: int) -> ItemResponse:
    item = db.get_by_id(item_id)
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(item_id)
    return item
