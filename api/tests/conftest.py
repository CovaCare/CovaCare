import os
import sys
import tempfile
import pytest
import sqlite3

# Adjust the path to include the src directory
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))

from db import get_db_connection

@pytest.fixture
def test_db():
    # Create a temporary database file
    db_fd, db_path = tempfile.mkstemp()
    os.environ['DB_PATH'] = db_path
    
    # Create test tables
    conn = sqlite3.connect(db_path)
    with open('db/sql.sql', 'r') as f:
        conn.executescript(f.read())
    conn.close()
    
    yield db_path
    
    # Cleanup
    os.close(db_fd)
    os.unlink(db_path) 