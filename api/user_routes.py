from flask import Blueprint, request, make_response, jsonify
import jwt, datetime, re
from flask_bcrypt import Bcrypt
from model.user import User

users = Blueprint("users",__name__)
key = "jwt_secret"
bcrypt=Bcrypt()
# Part 4 - 1：user(member) system API
# signup
@users.route("/api/user", methods=["POST"])
def signup():
	try:
		front_request=request.get_json()
		name=front_request["name"]
		email=front_request["email"]
		password=front_request["password"]
		pw_hash = bcrypt.generate_password_hash(password)
		result = User.check_signup_information(email)
		if result:
			response_error={
				"error": True,
				"message": "註冊失敗，此 Email 已註冊過"
			}
			response = make_response(jsonify(response_error), 400)
			return response 
		else:
			email_regex = re.compile("[^@]+@[^@]+\.[^@]+")
			password_regex = re.compile("^(?=.*\d)(?=.*[a-zA-Z]).{4,8}$")
			email_result= re.fullmatch(email_regex, email)
			password_result = re.fullmatch(password_regex, password)
			if email_result and password_result :
				User.sign_up(name, email, pw_hash)
				response_ok={
					"ok": True
				}
				response = make_response(jsonify(response_ok), 200)
				return response 
			else:
				response_error={
					"error": True,
					"message": "Email 或 密碼格式錯誤"
				}
				response = make_response(jsonify(response_error), 400)
				return response
	except:
		response_error={
			"error": True,
			"message": "伺服器內部錯誤"
		}
		response = make_response(jsonify(response_error), 500)
		return response

# signin 
@users.route("/api/user/auth", methods=["PUT"])
def signin():
	try:
		front_request=request.get_json()
		email=front_request["email"]
		password=front_request["password"]
		result = User.sign_in(email)
		if result==None:
			response_error={
				"error": True,
				"message": "電子郵件或密碼輸入錯誤"
			}
			response = make_response(jsonify(response_error), 400)
			return response 
		else:		
			check_password = bcrypt.check_password_hash(result["password"], password)
			if email==result["email"] and check_password:
				response_ok={
					"ok": True
				}
				token = jwt.encode(
					{
						"id":result["id"],
						"name":result["name"], 
						"email":result["email"]
					},
					"jwt_secret", algorithm="HS256")
				response = make_response(jsonify(response_ok), 200)
				expiretime=datetime.datetime.now() + datetime.timedelta(days=7)
				response.set_cookie("token", token, expires=expiretime)
				return response 
		response_error={
			"error": True,
			"message": "電子郵件或密碼輸入錯誤"
		}
		response = make_response(jsonify(response_error), 400)
		return response 
	except:
		response_error={
			"error": True,
			"message": "伺服器內部錯誤"
		}
		response = make_response(jsonify(response_error), 500)
		return response

# get signin status/information
@users.route("/api/user/auth", methods=["GET"])
def get_signin():
	front_token=request.cookies.get("token")
	if front_token:
		user_token=jwt.decode(
			front_token, 
			"jwt_secret", 
			algorithms=["HS256"])
		response_end={
			"data": {
				"id": user_token["id"],
				"name": user_token["name"],
				"email":  user_token["email"]
			}
		}
	else:
		response_end={
			"data":None
		}
	response = make_response(jsonify(response_end), 200)
	return response 

# signout
@users.route("/api/user/auth", methods=["DELETE"])
def signout():
	response_ok={
		"ok": True
	}
	response = make_response(jsonify(response_ok), 200)
	response.set_cookie("token", "", expires=0)
	return response