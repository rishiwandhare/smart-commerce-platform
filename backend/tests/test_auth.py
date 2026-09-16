from app.core.config import settings


def test_health_check(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "price-comparator-backend"


def test_database_connection(client):
    response = client.get("/api/health/db")
    assert response.status_code == 200
    assert response.json()["database"] == "connected"


def test_register_and_login(client):
    payload = {
        "email": "new.customer@example.com",
        "password": "SecurePass123",
        "full_name": "New Customer",
        "role": "customer",
    }
    created = client.post("/api/auth/register", json=payload)
    assert created.status_code == 201
    body = created.json()
    assert body["user"]["email"] == payload["email"]
    assert body["access_token"]

    login = client.post("/api/auth/login", json={"email": payload["email"], "password": payload["password"]})
    assert login.status_code == 200
    me = client.get("/api/auth/me", headers={"Authorization": f"Bearer {login.json()['access_token']}"})
    assert me.status_code == 200
    assert me.json()["role"] == "customer"


def test_cannot_self_register_admin(client):
    response = client.post(
        "/api/auth/register",
        json={
            "email": "hacker@example.com",
            "password": "SecurePass123",
            "full_name": "Nope",
            "role": "admin",
        },
    )
    assert response.status_code == 403


def test_login_rejects_bad_password(client):
    response = client.post(
        "/api/auth/login",
        json={"email": settings.SEED_CUSTOMER_EMAIL, "password": "wrong-password"},
    )
    assert response.status_code == 401
