from decimal import Decimal

from tests.conftest import auth_header


def test_search_products(client):
    response = client.get("/api/search", params={"q": "iphone"})
    assert response.status_code == 200
    assert response.json()["products"] == []

    found = client.get("/api/search", params={"q": "nova"})
    assert found.status_code == 200
    data = found.json()
    assert data["products"]
    assert data["compared_offers"]
    assert data["selected_product"]["title"].lower().find("nova") >= 0


def test_price_comparison_sorts_by_final_price(client):
    products = client.get("/api/products").json()
    phone = next(item for item in products if "nova phone" in item["title"].lower())
    offers = client.get(f"/api/products/{phone['id']}/offers").json()
    assert len(offers) >= 3
    finals = [Decimal(str(item["final_price"])) for item in offers]
    assert finals == sorted(finals)
    cheapest = offers[0]
    for offer in offers:
        expected = Decimal(str(offer["sale_price"])) + Decimal(str(offer["delivery_cost"] or 0))
        assert Decimal(str(offer["final_price"])) == expected
        assert offer["buy_now_url"].startswith("http")
        assert offer["stock_status"]
    assert cheapest["store"]["name"] != "hardcoded"
    compare = client.get(f"/api/prices/compare/{phone['id']}").json()
    assert compare[0]["offer_id"] == cheapest["offer_id"]


def test_price_history(client):
    products = client.get("/api/products").json()
    phone = next(item for item in products if "nova phone" in item["title"].lower())
    history = client.get(f"/api/products/{phone['id']}/price-history")
    assert history.status_code == 200
    rows = history.json()
    assert len(rows) >= 3
    assert {"sale_price", "final_price", "recorded_at", "offer_id"} <= set(rows[0].keys())


def test_wishlist_and_alerts(client):
    headers = auth_header(client, "customer@local.dev", "CustPass123!")
    product_id = client.get("/api/products").json()[0]["id"]
    added = client.post("/api/wishlist", headers=headers, json={"product_id": product_id})
    assert added.status_code == 201
    listed = client.get("/api/wishlist", headers=headers)
    assert listed.status_code == 200
    assert listed.json()[0]["product_id"] == product_id
    deleted = client.delete(f"/api/wishlist/{product_id}", headers=headers)
    assert deleted.status_code == 204

    alert = client.post(
        "/api/alerts",
        headers=headers,
        json={"product_id": product_id, "target_price": "100000.00"},
    )
    assert alert.status_code == 201
    alerts = client.get("/api/alerts", headers=headers)
    assert alerts.status_code == 200
    assert alerts.json()[0]["is_triggered"] is True


def test_orders_and_nearby_stores(client):
    headers = auth_header(client, "customer@local.dev", "CustPass123!")
    nearby = client.get("/api/stores/nearby", params={"lat": 12.97, "lng": 77.59, "radius_km": 20})
    assert nearby.status_code == 200
    assert nearby.json()
    assert nearby.json()[0]["distance_km"] is not None

    products = client.get("/api/products").json()
    phone = next(item for item in products if "nova phone" in item["title"].lower())
    offers = client.get(f"/api/products/{phone['id']}/offers").json()
    city = next(item for item in offers if item["store"]["name"] == "City Mart Electronics")
    created = client.post(
        "/api/orders",
        headers=headers,
        json={
            "store_id": city["store"]["id"],
            "fulfillment_type": "pickup",
            "items": [{"offer_id": city["offer_id"], "quantity": 1}],
        },
    )
    assert created.status_code == 201, created.text
    assert created.json()["total"]
    listed = client.get("/api/orders", headers=headers)
    assert listed.status_code == 200
    assert listed.json()[0]["id"] == created.json()["id"]


def test_role_permissions(client):
    customer = auth_header(client, "customer@local.dev", "CustPass123!")
    shopkeeper = auth_header(client, "shopkeeper@local.dev", "ShopPass123!")
    admin = auth_header(client, "admin@local.dev", "AdminPass123!")

    assert client.get("/api/admin/users", headers=customer).status_code == 403
    assert client.get("/api/admin/users", headers=shopkeeper).status_code == 403
    users = client.get("/api/admin/users", headers=admin)
    assert users.status_code == 200
    assert len(users.json()) >= 3

    stores = client.get("/api/admin/stores", headers=admin)
    products = client.get("/api/admin/products", headers=admin)
    offers = client.get("/api/admin/offers", headers=admin)
    reports = client.get("/api/admin/reports", headers=admin)
    assert stores.status_code == 200
    assert products.status_code == 200
    assert offers.status_code == 200
    assert reports.status_code == 200
    assert reports.json()["product_count"] >= 2

    analytics = client.get("/api/shopkeeper/analytics", headers=shopkeeper)
    assert analytics.status_code == 200
    assert analytics.json()[0]["offer_count"] >= 1

    unauth = client.get("/api/wishlist")
    assert unauth.status_code == 401
