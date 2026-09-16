from tests.conftest import auth_header


def test_list_and_get_products(client):
    listing = client.get("/api/products")
    assert listing.status_code == 200
    products = listing.json()
    assert len(products) >= 2
    product_id = products[0]["id"]
    detail = client.get(f"/api/products/{product_id}")
    assert detail.status_code == 200
    body = detail.json()
    assert body["title"]
    assert body["offers"]


def test_shopkeeper_product_crud(client):
    headers = auth_header(client, "shopkeeper@local.dev", "ShopPass123!")
    stores = client.get("/api/shopkeeper/stores", headers=headers)
    assert stores.status_code == 200
    store_id = stores.json()[0]["id"]
    created = client.post(
        "/api/shopkeeper/products",
        headers=headers,
        json={
            "title": "Nova Phone Case",
            "store_id": store_id,
            "brand": "Nova",
            "sku": "CM-CASE-01",
            "product_url": "https://citymart.local/products/case",
            "list_price": "999.00",
            "sale_price": "799.00",
            "delivery_cost": "0.00",
            "quantity": 12,
        },
    )
    assert created.status_code == 201, created.text
    product_id = created.json()["id"]
    updated = client.put(
        f"/api/shopkeeper/products/{product_id}",
        headers=headers,
        json={"sale_price": "749.00", "list_price": "999.00"},
    )
    assert updated.status_code == 200
    assert float(updated.json()["offers"][0]["sale_price"]) == 749.0


def test_customer_cannot_create_shopkeeper_product(client):
    headers = auth_header(client, "customer@local.dev", "CustPass123!")
    response = client.post(
        "/api/shopkeeper/products",
        headers=headers,
        json={
            "title": "Blocked",
            "store_id": 1,
            "sku": "X",
            "product_url": "https://example.local",
            "list_price": "10.00",
            "sale_price": "9.00",
            "quantity": 1,
        },
    )
    assert response.status_code == 403
