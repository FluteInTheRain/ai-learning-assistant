import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    return TestClient(app)


class TestRoot:
    def test_root_redirects_to_docs(self, client: TestClient) -> None:
        response = client.get("/", follow_redirects=False)
        assert response.status_code == 307
        assert response.headers["location"] == "/docs"


class TestCreateItem:
    def test_create_item(self, client: TestClient) -> None:
        payload = {"name": "laptop", "description": "a fast laptop"}
        response = client.post("/items", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == 1
        assert data["name"] == "laptop"
        assert data["description"] == "a fast laptop"

    def test_create_item_without_description(self, client: TestClient) -> None:
        payload = {"name": "mouse"}
        response = client.post("/items", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == 2
        assert data["name"] == "mouse"
        assert data["description"] is None

    def test_create_item_validation_error(self, client: TestClient) -> None:
        payload = {"name": ""}
        response = client.post("/items", json=payload)
        assert response.status_code == 422


class TestReadItems:
    def test_get_all_items(self, client: TestClient) -> None:
        response = client.get("/items")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 2


class TestReadItem:
    def test_get_item_by_id(self, client: TestClient) -> None:
        response = client.get("/items/1")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == 1
        assert data["name"] == "laptop"

    def test_get_item_not_found(self, client: TestClient) -> None:
        response = client.get("/items/9999")
        assert response.status_code == 404
        assert response.json()["detail"] == "Item not found"


class TestUpdateItem:
    def test_update_item(self, client: TestClient) -> None:
        payload = {"name": "gaming laptop", "description": "updated description"}
        response = client.put("/items/1", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "gaming laptop"
        assert data["description"] == "updated description"

    def test_update_item_partial(self, client: TestClient) -> None:
        payload = {"name": "wireless mouse"}
        response = client.put("/items/2", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "wireless mouse"
        assert data["description"] is None

    def test_update_item_not_found(self, client: TestClient) -> None:
        payload = {"name": "ghost"}
        response = client.put("/items/9999", json=payload)
        assert response.status_code == 404
        assert response.json()["detail"] == "Item not found"


class TestDeleteItem:
    def test_delete_item(self, client: TestClient) -> None:
        response = client.delete("/items/2")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == 2

        get_response = client.get("/items/2")
        assert get_response.status_code == 404

    def test_delete_item_not_found(self, client: TestClient) -> None:
        response = client.delete("/items/9999")
        assert response.status_code == 404
        assert response.json()["detail"] == "Item not found"
