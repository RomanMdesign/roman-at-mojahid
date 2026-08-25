# 💬 Roman at Mojahid

Isang full-stack chat application na may:
- **Login gamit ang pangalan** (walang password, simple lang)
- **Group Chat** — makikita ng lahat ng users
- **Private Chat** — one-on-one na usapan sa ibang users

| Code/Language | Ginamit para saan |
|---|---|
| **HTML** (`index.html`) | Login screen at chat interface |
| **CSS** (`style.css`) | Disenyo — sidebar, chat bubbles, atbp. |
| **JavaScript** (`script.js`) | Pag-login, pagpapalit ng chat, pag-send/receive ng mensahe |
| **Python / Flask** (`app.py`) | Backend server at API |
| **SQL** (`database.sql`) | Istruktura ng database (users at messages) |
| **Bash** (`run.sh`) | Automation script |

## 🚀 Paano Patakbuhin sa Sarili Mong Computer

1. I-install ang **Python 3**
2. Buksan ang Terminal/Command Prompt sa loob ng folder
3. Patakbuhin:

**Mac/Linux:**
```bash
chmod +x run.sh
./run.sh
```

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

4. Buksan ang browser sa **http://localhost:5000**

## 🌐 Paano I-deploy sa Render (para may sariling link)

1. I-upload ang lahat ng files (maliban sa `venv` folder) sa GitHub repository mo
2. Sa Render, gumawa ng bagong Web Service, ikonekta ang repository
3. **Build Command:** `pip install -r requirements.txt`
4. **Start Command:** `gunicorn app:app`
5. Piliin ang Free plan, i-deploy

## 🛠️ Paano Gamitin
1. Mag-type ng pangalan sa login screen
2. Sa "Group Chat", makikita ng lahat ng users ang mensahe mo
3. I-click ang pangalan ng ibang user sa sidebar para mag-private chat
4. Nag-a-update ang mga mensahe kada 3 segundo (awtomatiko)

## 💡 Paalala
- Walang password — sinuman na mag-type ng parehong pangalan ay ituturing na parehong account
- Naka-save ang session sa browser (localStorage), kaya hindi ka na kailangang mag-login ulit sa parehong browser
- Para makipag-chat sa ibang tao, kailangang magbukas sila ng link mo at mag-login gamit ang sarili nilang pangalan
