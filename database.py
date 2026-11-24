
import mysql.connector


def get_connection():

    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="8625966337",
        database="restaurant_db"
    )

    return conn


def fetch_menu():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT food_id, food_name, category, price, food_image
        FROM restaurant_menu
        WHERE availability = TRUE
    """)

    menu = cursor.fetchall()
    cursor.close()
    conn.close()

    return menu
