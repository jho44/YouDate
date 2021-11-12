import pytest
from fastapi.testclient import TestClient
import neo_config
import match_pool

from main import app

@pytest.fixture(scope="module")
def test_app():
    client = TestClient(app)
    yield client

@pytest.fixture(scope="module")
def test_db():
    uri="neo4j+s://ce94f876.databases.neo4j.io"
    user="neo4j"
    password=neo_config.NEO_PASSWORD

    neo_db = match_pool.MatchPool(uri, user, password)
    return neo_db
