import requests
import json

url = 'http://127.0.0.1:8000/accounts/otp/send/'
payload = {'phone': '+10000000000', 'full_name': 'Test User'}
try:
    r = requests.post(url, json=payload, timeout=10)
    print('STATUS:', r.status_code)
    print('HEADERS:', r.headers)
    print('BODY:', r.text)
except Exception as e:
    print('ERROR:', e)
