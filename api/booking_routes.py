from flask import Blueprint, request, make_response, jsonify
import jwt
from api.connection import connection_pool

bookings = Blueprint("bookings",__name__)

# Part 5 - 1：booking API
# get booking information
@bookings.route("/api/booking", methods=["GET"])
def get_booking():
    try:        
        front_token = request.cookies.get("token")
        if front_token:
            user_token=jwt.decode(
                front_token, 
                "jwt_secret", 
                algorithms=["HS256"]
            )
            user_id = user_token["id"]
            connection_object = connection_pool.get_connection()
            cursor =  connection_object.cursor(dictionary=True)
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
            if result:
                image = result["images"].split(",")
                response_end={
                    "data": {
                        "attraction": {
                            "id": result["id"],
                            "name": result["name"],
                            "address": result[ "address"],
                            "image":image[0]
                        },
                        "date": result["date"],
                        "time": result["time"],
                        "price": result["price"]
                    }
                }
            else:
                response_end={
                    "data": None
                }
            response = make_response(jsonify(response_end), 200)
            return response 
        else:
            response_error={
                "error": True,
                "message": "未登入系統，拒絕存取"
            }
            response = make_response(jsonify(response_error), 403)
            return response 
    finally:
        cursor.close()
        connection_object.close()

# create new booking
@bookings.route("/api/booking", methods=["POST"])
def new_booking():
    try:
        front_token = request.cookies.get("token")
        if front_token:
            user_token=jwt.decode(
                front_token, 
                "jwt_secret", 
                algorithms=["HS256"]
            )
            user_id = user_token["id"]
            connection_object = connection_pool.get_connection()
            cursor =  connection_object.cursor()
            find_booking = "SELECT user_id FROM booking WHERE user_id=%s"
            cursor.execute(find_booking, (user_id,))    
            result=cursor.fetchone()
            if result:
                delete_booking = "DELETE FROM booking WHERE user_id=%s;"
                cursor.execute(delete_booking, (user_id,))
                connection_object.commit()     
            front_request = request.get_json()
            attraction_id = front_request["attractionId"]
            date = front_request["date"]
            time = front_request["time"]
            price = front_request["price"]
            if date and time:
                new_booking = "INSERT INTO booking(user_id, attraction_id, date, time, price) VALUES (%s, %s, %s, %s, %s)"
                newdata = (user_id, attraction_id, date, time, price)
                cursor.execute(new_booking, newdata)
                connection_object.commit()
                response_ok={
                    "ok": True
                }
                response = make_response(jsonify(response_ok), 200)
                return response 
            else:
                response_error={
                    "error": True,
                    "message": "未選擇日期或時間"
                }
                response = make_response(jsonify(response_error), 400)
                return response 
        else:
            response_error={
                "error": True,
                "message": "未登入系統，拒絕存取"
            }
            response = make_response(jsonify(response_error), 403)
            return response 
    except:
        response_error={
            "error": True,
            "message": "伺服器內部錯誤"
        }
        response = make_response(jsonify(response_error), 500)
        return response
    finally:
        cursor.close()
        connection_object.close()

# delete booking
@bookings.route("/api/booking", methods=["DELETE"])
def delete_booking():
    try:
        front_token = request.cookies.get("token")
        if front_token:
            user_token=jwt.decode(
                front_token, 
                "jwt_secret", 
                algorithms=["HS256"]
            )
            user_id = user_token["id"]
            connection_object = connection_pool.get_connection()
            cursor =  connection_object.cursor()
            delete_booking = "DELETE FROM booking WHERE user_id=%s;"
            cursor.execute(delete_booking, (user_id,))
            connection_object.commit()
            response_ok={
                "ok": True
            }
            response = make_response(jsonify(response_ok), 200)
            return response 
        else:
            response_error={
                "error": True,
                "message": "未登入系統，拒絕存取"
            }
            response = make_response(jsonify(response_error), 403)
            return response
    finally:
        cursor.close()
        connection_object.close()