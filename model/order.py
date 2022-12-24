from model.database import connection_pool

class Order:
    def search_booking_information(user_id):
        try:
            connection_object = connection_pool.get_connection()
            cursor = connection_object.cursor(dictionary=True)
            find_booking = "SELECT * FROM booking WHERE user_id = %s"
            cursor.execute(find_booking, (user_id,))    
            result=cursor.fetchone()
            return result 
        finally:
            cursor.close()
            connection_object.close()

    def create_new_order(user_id, attraction_id, order_number, price, pay_status, date, time, name, email, phone):
        try:
            connection_object = connection_pool.get_connection()
            cursor = connection_object.cursor()
            new_order = """INSERT INTO 
                        orders(user_id, attraction_id, order_number, price, pay_status, date, time, name, email, phone)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""
            newdata = (user_id, attraction_id, order_number, price, pay_status, date, time, name, email, phone)
            cursor.execute(new_order, newdata)
            connection_object.commit()
        finally:
            cursor.close()
            connection_object.close()
    
    def payorder_status_change(order_number):
        try:
            connection_object = connection_pool.get_connection()
            cursor = connection_object.cursor()
            pay_order = "UPDATE orders SET pay_status = 0 WHERE order_number = %s;"
            cursor.execute(pay_order, (order_number,))
            connection_object.commit()
        finally:
            cursor.close()
            connection_object.close()

    def get_order_information(order_number):
        try:
            connection_object = connection_pool.get_connection()
            cursor = connection_object.cursor(dictionary=True)
            get_order = """
            SELECT
                orders.price, orders.date, orders.time, orders.name AS contact_name,
                orders.email, orders.phone, orders.pay_status, 
                attractions.id, attractions.name, 
                attractions.address, attractions.images
            FROM orders 
            INNER JOIN attractions ON orders.attraction_id = attractions.id
            WHERE order_number = %s
            """
            cursor.execute(get_order, (order_number,))
            result=cursor.fetchone()
            return result 
        finally:
            cursor.close()
            connection_object.close()