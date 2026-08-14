
from app.models import ItemCreate, ItemResponse, ItemUpdate


class InMemoryDB:
    def __init__(self) -> None:
        self._items: dict[int, ItemResponse] = {}
        self._counter: int = 1

    def create(self, item_in: ItemCreate) -> ItemResponse:
        item = ItemResponse(
            id=self._counter, name=item_in.name, description=item_in.description
        )
        self._items[self._counter] = item
        self._counter += 1
        return item

    def get_all(self) -> list[ItemResponse]:
        return list(self._items.values())

    def get_by_id(self, item_id: int) -> ItemResponse | None:
        return self._items.get(item_id)

    def update(self, item_id: int, item_in: ItemUpdate) -> ItemResponse | None:
        existing = self._items.get(item_id)
        if existing is None:
            return None
        updated_data = existing.model_dump()
        if item_in.name is not None:
            updated_data["name"] = item_in.name
        if item_in.description is not None:
            updated_data["description"] = item_in.description
        updated_item = ItemResponse(**updated_data)
        self._items[item_id] = updated_item
        return updated_item

    def delete(self, item_id: int) -> bool:
        if item_id in self._items:
            del self._items[item_id]
            return True
        return False


db = InMemoryDB()
