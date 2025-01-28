# Database Helpers
import os
import sqlite3

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DB_FILENAME = os.path.join(BASE_DIR, '..', 'data', 'covacare.db')

def get_db_connection():
    # Set a timeout of 10 seconds and enable WAL mode to improve concurrent access.
    conn = sqlite3.connect(DB_FILENAME, timeout=10)
    conn.row_factory = sqlite3.Row
    conn.execute('PRAGMA journal_mode=WAL;')
    return conn

def query_db(query, args=(), one=False, commit=False):
    conn = get_db_connection()
    try:
        cursor = conn.execute(query, args)
        if commit:
            conn.commit()
            return
        results = cursor.fetchall()
        return (results[0] if results else None) if one else results
    except sqlite3.OperationalError as e:
        print(f"Database operational error: {e}")
        raise
    finally:
        conn.close()

