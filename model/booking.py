from model.database import connection_pool

class Booking:
    def get_booking_information(user_id):
        try:
            connection_object = connection_pool.get_connection()
            cursor = connection_object.cursor(dictionary=True)
            get_booking = """
            SELECT 
                attractions.id, attractions.name, 
                attractions.address, attractions.images, 
                booking.date, booking.time, booking.price 
            FROM attractions INNER JOIN booking ON attractions.id=booking.attraction_id 
            WHERE booking.user_id=%s
            """
            cursor.execute(get_booking,(user_id,))
            result=cursor.fetchone() 
            return result  
        finally:
            cursor.close()
            connection_object.close()

    def user_booking_information(user_id):
        try:
            connection_object = connection_pool.get_connection()
            cursor = connection_object.cursor(dictionary=True)
            find_booking = "SELECT user_id FROM booking WHERE user_id=%s"
            cursor.execute(find_booking, (user_id,))    
            result=cursor.fetchone()
            return result 
        finally:
            cursor.close()
            connection_object.close()

    def create_new_booking(user_id, attraction_id, date, time, price):
        try:
            connection_object = connection_pool.get_connection()
            cursor = connection_object.cursor(dictionary=True)
            new_booking = "INSERT INTO booking(user_id, attraction_id, date, time, price) VALUES (%s, %s, %s, %s, %s)"
            newdata = (user_id, attraction_id, date, time, price)
            cursor.execute(new_booking, newdata)
            connection_object.commit()
        finally:
            cursor.close()
            connection_object.close()

    def delete_booking(user_id):
        try:
            connection_object = connection_pool.get_connection()
            cursor = connection_object.cursor(dictionary=True)
            delete_booking = "DELETE FROM booking WHERE user_id=%s;"
            cursor.execute(delete_booking, (user_id,))
            connection_object.commit()
        finally:
            cursor.close()
            connection_object.close()
