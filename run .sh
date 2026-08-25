#!/bin/bash
# ===== run.sh =====
echo "=================================================="
echo " Sinisimulan ang Messenger App..."
echo "=================================================="

if [ ! -d "venv" ]; then
    echo "Gumagawa ng virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate

echo "Nagi-install ng mga dependencies..."
pip install -r requirements.txt

echo "Pinapatakbo ang application sa http://localhost:5000"
python3 app.py
