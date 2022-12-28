from flask import Blueprint, request, make_response, jsonify
from dotenv import load_dotenv
from datetime import datetime, timezone, timedelta
import jwt, re, os, requests, json
from model.order import Order
from model.booking import Booking

orders = Blueprint("orders", __name__)

load_dotenv() 
partner_key=os.getenv("partner_key")
merchant_id=os.getenv("merchant_id")

@orders.route("/api/order", methods=["POST"])
def create_order():
    try:
        front_token = request.cookies.get("token")
        if front_token:
            user_token=jwt.decode(
                front_token, 
                "jwt_secret", 
                algorithms=["HS256"]
            )
            user_id = user_token["id"]
            order_front_request=request.get_json()
            name =  order_front_request["order"]["contact"]["name"]
            email = order_front_request["order"]["contact"]["email"]
            phone = order_front_request["order"]["contact"]["phone"]
            if name == "" or email =="" or phone == "":
                response_error={
                    "error": True,
                    "message": "聯絡資訊填寫不完全"
                }
                response = make_response(jsonify(response_error), 400)
                return response                 
            email_regex = re.compile(r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-.]+){1,}$')
            phone_regex = re.compile(r'^09\d{8}$')
            email_result= re.fullmatch(email_regex, email)
            phone_result = re.fullmatch(phone_regex, phone)
            if email_result and phone_result :
                booking_information = Order.search_booking_information(user_id)
                booking_id = booking_information["id"]
                attraction_id = booking_information["attraction_id"]
                price = booking_information["price"]
                date = booking_information["date"]
                time = booking_information["time"]
                order_number = datetime.now(timezone(timedelta(hours=+8)))
                order_number = order_number.strftime("%Y%m%d%H%M%S") +"-"+ str(booking_id)
                pay_status = 1 # haven't pay 
                Order.create_new_order(user_id, attraction_id, order_number, price, pay_status, date, time, name, email, phone)
                Booking.delete_booking(user_id)
                paydata = {
                    "prime":  order_front_request["prime"],
                    "partner_key": partner_key,
                    "merchant_id": merchant_id,
                    "details":"TapPay Test",
                    "amount": price,
                    "cardholder": {
                        "phone_number": phone,
                        "name": name,
                        "email": email,
                    },
                    "remember": True
                }
                paydata=json.dumps(paydata)
                # Fetching Data Using Tappay API
                tappay_response = requests.post(
                    "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime",
                    paydata,
                    headers={"Content-Type": "application/json", 
                    "x-api-key": partner_key},
                ).json()
                if tappay_response["status"] == 0:
                    Order.payorder_status_change(order_number)
                    pay_status=0   
                    pay_status_message="付款成功"   
                else: 
                    pay_status_message="付款失敗"             
                response = {
                    "data": {
                        "number": order_number,
                        "payment": {
                            "status": pay_status,
                            "message": pay_status_message
                        }
                    }   
                }
                response = make_response(jsonify(response), 200)
                return response 
            else:
                response_error={
                    "error": True,
                    "message": "信箱或手機號碼格式錯誤"
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
    except Exception as e:
        print(e)
        response_error={
            "error": True,
            "message": "伺服器內部錯誤"
        }
        response = make_response(jsonify(response_error), 500)
        return response

@orders.route("/api/order/<orderNumber>", methods=["GET"])
def get_order(orderNumber):
    try:
        front_token = request.cookies.get("token")
        if front_token:
            result = Order.get_order_information(orderNumber)
            if result:
                image = result["images"].split(",")
                response = {
                    "data": {
                        "number": orderNumber,
                        "price": result["price"],
                        "trip": {
                            "attraction": {
                                "id": result["id"],
                                "name": result["name"],
                                "address": result["address"],
                                "image": image[0]
                            },
                            "date": result["date"],
                            "time": result["time"]
                        },
                        "contact": {
                        "name": result["contact_name"],
                        "email": result["email"],
                        "phone": result["phone"]
                        },
                        "status": result["pay_status"]
                    }
                }
            else:
                response = {"data": None}
            response = make_response(jsonify(response), 200)
            return response 
        else:
            response_error={
                "error": True,
                "message": "未登入系統，拒絕存取"
            }
            response = make_response(jsonify(response_error), 403)
            return response 
    except Exception:
        response_error={
            "error": True,
            "message": "伺服器內部錯誤"
        }
        response = make_response(jsonify(response_error), 500)
        return response