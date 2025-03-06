# Database Helpers
import os
import sqlite3

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_FILENAME = os.path.join(BASE_DIR, 'db', 'covacare.db')

def get_db_connection():
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
            return {'lastrowid': cursor.lastrowid, 'rowcount': cursor.rowcount}
        results = cursor.fetchall()
        return (results[0] if results else None) if one else results
    except sqlite3.OperationalError as e:
        print(f"Database operational error: {e}")
        raise
    finally:
        conn.close()