from model.database import connection_pool

class User:
    def check_signup_information(email):
        try:
            connection_object = connection_pool.get_connection()
            cursor = connection_object.cursor()
            query=("SELECT email FROM user WHERE email=%s")
            cursor.execute(query, (email,))
            result = cursor.fetchone()
            return result
        finally:
            cursor.close()
            connection_object.close()

    def sign_up(name, email, pw_hash):
        try:
            connection_object = connection_pool.get_connection()
            cursor = connection_object.cursor()
            add_member="INSERT INTO user(name, email, password) VALUES (%s, %s, %s)"
            newdata=(name, email, pw_hash)
            cursor.execute(add_member, newdata)
            connection_object.commit()
        finally:
            cursor.close()
            connection_object.close()
    
    def sign_in(email):
        try:
            connection_object = connection_pool.get_connection()
            cursor = connection_object.cursor(dictionary=True)
            query=("SELECT id, name, email, password FROM user WHERE email=%s")
            cursor.execute(query, (email,))
            result = cursor.fetchone()
            return result
        finally:
            cursor.close()
            connection_object.close()