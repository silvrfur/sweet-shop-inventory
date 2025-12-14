def test_login_fails_with_invalid_credentials(client):
    response = client.post(
        "/api/auth/login",
        json={
            "email": "wrong@example.com",
            "password": "wrongpassword"
        }
    )

    assert response.status_code == 401

def test_login_fails_when_fields_missing(client):
    response = client.post(
        "/api/auth/login",
        json={"email": "test@example.com"}
    )

    assert response.status_code == 400
