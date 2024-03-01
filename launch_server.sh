source .venv/bin/activate
pip install -r requirements.txt

python flask-server/server_opc.py &
sleep 5
python flask-server/server.py &
sleep 5
python flask-server/simulator.py &
sleep 2

cd client
npm start &
cd ..
