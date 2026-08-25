# ===== app.py =====
# Python (Flask) backend para sa Messenger app

from flask import Flask, jsonify, request, send_from_directory
import sqlite3
from datetime import datetime

app = Flask(__name__, static_folder='.', static_url_path='')
DB_NAME = "messenger.db"


# ---------- SETUP NG DATABASE (SQL) ----------
def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sender_id INTEGER NOT NULL,
            receiver_id INTEGER,
            text TEXT NOT NULL,
            timestamp TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()


def get_connection():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn


# ---------- ROUTE PARA SA FRONTEND ----------
@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')


# ---------- LOGIN (gumawa ng user kung wala pa) ----------
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username', '').strip()

    if not username:
        return jsonify({"error": "Kailangan ng pangalan"}), 400

    conn = get_connection()
    existing = conn.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone()

    if existing:
        user = dict(existing)
    else:
        cursor = conn.execute("INSERT INTO users (username) VALUES (?)", (username,))
        conn.commit()
        user = {"id": cursor.lastrowid, "username": username}

    conn.close()
    return jsonify(user)


# ---------- KUNIN ANG LAHAT NG USERS (para sa sidebar) ----------
@app.route('/api/users', methods=['GET'])
def get_users():
    exclude_id = request.args.get('exclude')
    conn = get_connection()
    rows = conn.execute("SELECT * FROM users WHERE id != ? ORDER BY username", (exclude_id,)).fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])


# ---------- KUNIN ANG MGA MENSAHE ----------
@app.route('/api/messages', methods=['GET'])
def get_messages():
    user_id = request.args.get('user_id')
    target = request.args.get('target')  # 'group' o user id

    conn = get_connection()

    if target == 'group':
        rows = conn.execute("""
            SELECT messages.*, users.username as sender_name
            FROM messages
            JOIN users ON messages.sender_id = users.id
            WHERE messages.receiver_id IS NULL
            ORDER BY messages.id ASC
        """).fetchall()
    else:
        rows = conn.execute("""
            SELECT messages.*, users.username as sender_name
            FROM messages
            JOIN users ON messages.sender_id = users.id
            WHERE (sender_id = ? AND receiver_id = ?)
               OR (sender_id = ? AND receiver_id = ?)
            ORDER BY messages.id ASC
        """, (user_id, target, target, user_id)).fetchall()

    conn.close()

    messages = []
    for row in rows:
        msg = dict(row)
        try:
            dt = datetime.fromisoformat(msg['timestamp'])
            msg['time'] = dt.strftime('%I:%M %p')
        except Exception:
            msg['time'] = ''
        messages.append(msg)

    return jsonify(messages)


# ---------- MAGPADALA NG MENSAHE ----------
@app.route('/api/messages', methods=['POST'])
def send_message():
    data = request.get_json()
    sender_id = data.get('sender_id')
    target = data.get('target')  # 'group' o user id
    text = data.get('text', '').strip()

    if not text:
        return jsonify({"error": "Walang laman ang mensahe"}), 400

    receiver_id = None if target == 'group' else target
    timestamp = datetime.now().isoformat()

    conn = get_connection()
    conn.execute(
        "INSERT INTO messages (sender_id, receiver_id, text, timestamp) VALUES (?, ?, ?, ?)",
        (sender_id, receiver_id, text, timestamp)
    )
    conn.commit()
    conn.close()

    return jsonify({"message": "Naipadala ang mensahe"}), 201


init_db()

if __name__ == '__main__':
    print("=" * 50)
    print("Messenger App - tumatakbo na sa http://localhost:5000")
    print("=" * 50)
    app.run(debug=True, port=5000)
