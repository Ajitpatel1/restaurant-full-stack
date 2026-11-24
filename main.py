from database import fetch_menu

menu = fetch_menu()

print("\n========== PATEL RESTAURANT ==========\n")

for food in menu:

    print(f"Food ID   : {food['food_id']}")
    print(f"Food Name : {food['food_name']}")
    print(f"Category  : {food['category']}")
    print(f"Price     : ₹{food['price']}")
    print("--------------------------------------")