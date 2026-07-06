import datetime
import jwt

JWT_SECRET = "supersecretjwtkeyforstartsmartai2026!!!"
JWT_ALGORITHM = "HS256"

# 1. Generate token
data = {"sub": 1}
expire = datetime.datetime.utcnow() + datetime.timedelta(minutes=1440)
data.update({"exp": expire})
token = jwt.encode(data, JWT_SECRET, algorithm=JWT_ALGORITHM)

print(f"Generated token: {token}")

# 2. Decode token
try:
    payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    print(f"Successfully decoded: {payload}")
except Exception as e:
    print(f"Error decoding: {e}")
