-- ===== database.sql =====
-- SQL schema para sa Messenger application
-- Awtomatiko itong nililikha ng app.py, pero ito ang sanggunian.

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER,          -- NULL kung group chat message
    text TEXT NOT NULL,
    timestamp TEXT NOT NULL
);
