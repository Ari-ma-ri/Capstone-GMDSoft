import sqlite3

def check_db():
    conn = sqlite3.connect('detections.db')
    c = conn.cursor()
    c.execute('SELECT * FROM detections')
    rows = c.fetchall()
    for row in rows:
        print(row)
    conn.close()

if __name__ == '__main__':
    check_db()

