import mysql.connector
from datetime import datetime, timedelta
import random

# Kết nối MySQL
conn = mysql.connector.connect(
    host="localhost",
    port=3390,
    user="device_user",
    password="device_pass",
    database="device_checking"
)
cursor = conn.cursor()

# --------- 🛠️ Tạo bảng (Create tables) ---------

cursor.execute("""
CREATE TABLE IF NOT EXISTS Device (
    deviceID INT AUTO_INCREMENT PRIMARY KEY,
    deviceName VARCHAR(255) NOT NULL,
    description TEXT,
    coordinates VARCHAR(255)
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS User (
    userID INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role VARCHAR(50)
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS Scan (
    scanID INT AUTO_INCREMENT PRIMARY KEY,
    userID INT,
    timestamp DATETIME,
    location VARCHAR(255),
    FOREIGN KEY (userID) REFERENCES User(userID) ON DELETE CASCADE
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS Count (
    countID INT AUTO_INCREMENT PRIMARY KEY,
    scanID INT,
    deviceID INT,
    number INT,
    FOREIGN KEY (scanID) REFERENCES Scan(scanID) ON DELETE CASCADE,
    FOREIGN KEY (deviceID) REFERENCES Device(deviceID) ON DELETE CASCADE
)
""")

conn.commit()

# --------- 🧹 Xóa dữ liệu cũ (Clear old data) ---------
cursor.execute("DELETE FROM Count")
cursor.execute("DELETE FROM Scan")
cursor.execute("DELETE FROM Device")
cursor.execute("DELETE FROM User")
conn.commit()

# --------- 📥 Seed dữ liệu (Insert fake data) ---------

# Seed Device
devices = ['Máy 1 pha', 'Trạm giàn', 'Trạm trụ ghép', 'Trạm ngồi trụ ghép']
device_ids = []

for name in devices:
    cursor.execute(
        "INSERT INTO Device (deviceName, description, coordinates) VALUES (%s, %s, %s)",
        (name, f"Mô tả cho {name}", f"{random.uniform(10.7, 10.9):.6f},{random.uniform(106.6, 106.8):.6f}")
    )
    device_ids.append(cursor.lastrowid)

# Seed Users
users = [
    ('admin@example.com', 'hashed_admin_pass', 'Admin User', 'admin'),
    ('user1@example.com', 'hashed_user1_pass', 'User One', 'user'),
    ('user2@example.com', 'hashed_user2_pass', 'User Two', 'user')
]
user_ids = []

for email, pwd, name, role in users:
    cursor.execute(
        "INSERT INTO User (email, password, name, role) VALUES (%s, %s, %s, %s)",
        (email, pwd, name, role)
    )
    user_ids.append(cursor.lastrowid)

# Seed Scan and Count
for _ in range(5):  # tạo 5 phiên quét
    user_id = random.choice(user_ids)
    scan_time = datetime.now() - timedelta(days=random.randint(0, 10))
    location = f"Vị trí {random.randint(1, 5)}"

    cursor.execute(
        "INSERT INTO Scan (userID, timestamp, location) VALUES (%s, %s, %s)",
        (user_id, scan_time.strftime("%Y-%m-%d %H:%M:%S"), location)
    )
    scan_id = cursor.lastrowid

    # Mỗi scan có thể có từ 1-3 thiết bị được đếm
    for _ in range(random.randint(1, 3)):
        device_id = random.choice(device_ids)
        number = random.randint(1, 10)
        cursor.execute(
            "INSERT INTO Count (scanID, deviceID, number) VALUES (%s, %s, %s)",
            (scan_id, device_id, number)
        )

conn.commit()
cursor.close()
conn.close()

print("✅ Dữ liệu giả đã được thêm thành công!")
