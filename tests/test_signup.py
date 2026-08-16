from httpx import AsyncClient


async def test_signup_success(client: AsyncClient) -> None:
    response = await client.post(
        "/auth/signup",
        json={
            "full_name": "Minh Khang Nguyen",
            "email": "khang@university.edu",
            "password": "correct-horse-battery",
            "track_preference": "applied",
        },
    )

    assert response.status_code == 201
    body = response.json()
    assert body["user"]["email"] == "khang@university.edu"
    assert body["user"]["full_name"] == "Minh Khang Nguyen"
    assert "password" not in body["user"]
    assert "password_hash" not in body["user"]
    assert body["access_token"]
    assert body["token_type"] == "bearer"


async def test_signup_duplicate_email_rejected(client: AsyncClient) -> None:
    payload = {
        "full_name": "Minh Khang Nguyen",
        "email": "dup@university.edu",
        "password": "correct-horse-battery",
        "track_preference": "technical",
    }

    first = await client.post("/auth/signup", json=payload)
    assert first.status_code == 201

    second = await client.post("/auth/signup", json=payload)
    assert second.status_code == 409


async def test_signup_duplicate_email_case_insensitive_rejected(
    client: AsyncClient,
) -> None:
    first = await client.post(
        "/auth/signup",
        json={
            "full_name": "Minh Khang Nguyen",
            "email": "Case@University.edu",
            "password": "correct-horse-battery",
            "track_preference": "applied",
        },
    )
    assert first.status_code == 201
    assert first.json()["user"]["email"] == "case@university.edu"

    second = await client.post(
        "/auth/signup",
        json={
            "full_name": "Someone Else",
            "email": "case@university.edu",
            "password": "correct-horse-battery",
            "track_preference": "technical",
        },
    )
    assert second.status_code == 409


async def test_signup_full_name_whitespace_only_rejected(client: AsyncClient) -> None:
    response = await client.post(
        "/auth/signup",
        json={
            "full_name": "   ",
            "email": "blank@university.edu",
            "password": "correct-horse-battery",
            "track_preference": "applied",
        },
    )

    assert response.status_code == 422


async def test_signup_password_too_short_rejected(client: AsyncClient) -> None:
    response = await client.post(
        "/auth/signup",
        json={
            "full_name": "Minh Khang Nguyen",
            "email": "short@university.edu",
            "password": "short1",
            "track_preference": "applied",
        },
    )

    assert response.status_code == 422
