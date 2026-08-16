from httpx import AsyncClient

SIGNUP_PAYLOAD = {
    "full_name": "Minh Khang Nguyen",
    "email": "login-test@university.edu",
    "password": "correct-horse-battery",
    "track_preference": "applied",
}


async def test_login_success(client: AsyncClient) -> None:
    signup = await client.post("/auth/signup", json=SIGNUP_PAYLOAD)
    assert signup.status_code == 201

    response = await client.post(
        "/auth/login",
        json={"email": SIGNUP_PAYLOAD["email"], "password": SIGNUP_PAYLOAD["password"]},
    )

    assert response.status_code == 200
    body = response.json()
    assert body["user"]["email"] == SIGNUP_PAYLOAD["email"]
    assert body["access_token"]


async def test_login_different_email_casing_succeeds(client: AsyncClient) -> None:
    signup = await client.post("/auth/signup", json=SIGNUP_PAYLOAD)
    assert signup.status_code == 201

    response = await client.post(
        "/auth/login",
        json={
            "email": "Login-Test@University.EDU",
            "password": SIGNUP_PAYLOAD["password"],
        },
    )

    assert response.status_code == 200


async def test_login_wrong_password_rejected(client: AsyncClient) -> None:
    signup = await client.post("/auth/signup", json=SIGNUP_PAYLOAD)
    assert signup.status_code == 201

    response = await client.post(
        "/auth/login",
        json={"email": SIGNUP_PAYLOAD["email"], "password": "totally-wrong-password"},
    )

    assert response.status_code == 401


async def test_login_unknown_email_rejected(client: AsyncClient) -> None:
    response = await client.post(
        "/auth/login",
        json={"email": "nobody@university.edu", "password": "whatever-password"},
    )

    assert response.status_code == 401
