import urllib.request
from datetime import datetime

# URL of the Node.js server (Change the port if your server runs on a different one)
url = "http://localhost:5000" 

try:
    response = urllib.request.urlopen(url)
    print(f"[{datetime.now()}] SUCCESS: UrbanDiary Server is UP! (Status: {response.getcode()})")
except Exception as e:
    print(f"[{datetime.now()}] ERROR: UrbanDiary Server is DOWN! ({e})")
