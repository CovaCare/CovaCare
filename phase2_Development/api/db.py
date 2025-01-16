# Database Helpers
import os
import sqlite3

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DB_FILENAME = os.path.join(BASE_DIR, '..', 'data', 'covacare.db')

def get_db_connection():
    conn = sqlite3.connect(DB_FILENAME)
    conn.row_factory = sqlite3.Row
    return conn

def query_db(query, args=(), one=False, commit=False):
    conn = get_db_connection()
    cursor = conn.execute(query, args)
    if commit:
        conn.commit()
        conn.close()
        return
    results = cursor.fetchall()
    conn.close()
    return (results[0] if results else None) if one else results
