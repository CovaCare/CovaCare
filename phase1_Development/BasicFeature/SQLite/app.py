from flask import Flask, jsonify, request
import sqlite3

app = Flask(__name__)

DATABASE = 'test.db'

# Function to connect to the database
def connect_db():
    connection = sqlite3.connect(DATABASE)
    connection.row_factory = sqlite3.Row
    return connection

# Route to fetch all records
@app.route('/data', methods=['GET'])
def get_data():
    conn = connect_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM test")
    rows = cursor.fetchall()
    conn.close()
    # Convert rows to a list of dictionaries
    data = [dict(row) for row in rows]
    return jsonify(data)

# Route to update a record
@app.route('/data/<int:id>', methods=['PUT'])
def update_data(id):
    conn = connect_db()
    cursor = conn.cursor()

    # Extract JSON data from the request
    update_info = request.json
    name = update_info.get('name')
    num = update_info.get('num')

    # Update the database
    cursor.execute(
        "UPDATE test SET name = ?, num = ? WHERE id = ?",
        (name, num, id)
    )
    conn.commit()
    conn.close()

    if cursor.rowcount == 0:
        return jsonify({"error": "Record not found"}), 404
    return jsonify({"message": "Record updated successfully"})

# Start the Flask application
if __name__ == '__main__':
    app.run(debug=True)
