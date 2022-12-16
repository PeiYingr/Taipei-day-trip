from flask import Blueprint, request, make_response, jsonify
from api.connection import connection_pool

attractions= Blueprint("attractions",__name__)

# 取得景點資料列表
@attractions.route("/api/attractions")
def show_attractions():
	try:
		connection_object = connection_pool.get_connection()
		cursor =  connection_object.cursor(dictionary=True)
		page = request.args.get("page", 0)
		keyword = request.args.get("keyword")
		page=int(page)
		attraction_list=[]
		if keyword == None:
			attraction = "SELECT * FROM attractions limit %s, 13"
			cursor.execute(attraction,(page*12,))
			result=cursor.fetchall()
			if len(result)>12:
				nextpage=page+1
				for x in result[0:12]:
					image=x["images"].split(",")
					response_json={
						"id" :x["id"], 
						"name" : x["name"],
						"category" :x["category"],
						"description" : x["description"],
						"address" : x["address"],
						"transport" : x["transport"],
						"mrt" : x["mrt"],
						"lat" : x["lat"],
						"lng" : x["lng"],
						"images" : image
					}
					attraction_list.append(response_json)
			else:
				nextpage=None
				for x in result:
					image=x["images"].split(",")
					response_json={
						"id" :x["id"], 
						"name" : x["name"],
						"category" :x["category"],
						"description" : x["description"],
						"address" : x["address"],
						"transport" : x["transport"],
						"mrt" : x["mrt"],
						"lat" : x["lat"],
						"lng" : x["lng"],
						"images" : image
					}
					attraction_list.append(response_json)
		else:
			attraction_search="SELECT * FROM attractions WHERE category=%s OR name LIKE %s LIMIT %s, 13"
			value=(keyword, f"%{keyword}%", page*12)
			# 也可使用 "%"+f"{keyword}"+"%"、"%"+keyword +"%" 
			cursor.execute(attraction_search, value)
			result = cursor.fetchall()
			if len(result)>12:
				nextpage=page+1
				for x in result[0:12]:
					image=x["images"].split(",")
					response_json={
						"id" :x["id"], 
						"name" : x["name"],
						"category" :x["category"],
						"description" : x["description"],
						"address" : x["address"],
						"transport" : x["transport"],
						"mrt" : x["mrt"],
						"lat" : x["lat"],
						"lng" : x["lng"],
						"images" : image
					}
					attraction_list.append(response_json)
			else:
				nextpage=None
				for x in result:
					image=x["images"].split(",")
					response_json={
						"id" :x["id"], 
						"name" : x["name"],
						"category" :x["category"],
						"description" : x["description"],
						"address" : x["address"],
						"transport" : x["transport"],
						"mrt" : x["mrt"],
						"lat" : x["lat"],
						"lng" : x["lng"],
						"images" : image
					}
					attraction_list.append(response_json)				
		all_data={
			"nextPage":nextpage,
			"data":attraction_list
		}
		response = make_response(jsonify(all_data), 200)
		return response 
	except:
		response_error={
			"error": True,
			"message": "伺服器內部錯誤"
		}
		response=make_response(jsonify(response_error), 500)
		return response
	finally:
		cursor.close()
		connection_object.close()


# 根據景點編號取得景點資料
@attractions.route("/api/attraction/<attractionId>")
def find_attraction(attractionId):
	try:
		attractionId = int(attractionId)
		connection_object = connection_pool.get_connection()
		cursor =  connection_object.cursor(dictionary=True)
		id_search="SELECT * FROM attractions WHERE id = %s"
		cursor.execute(id_search, (attractionId,))
		result_attraction = cursor.fetchone()
		if result_attraction:
			image = result_attraction["images"].split(",")
			response_json={
				"data":{
					"id" :result_attraction["id"], 
					"name" : result_attraction["name"],
					"category" :result_attraction["category"],
					"description" : result_attraction["description"],
					"address" : result_attraction["address"],
					"transport" : result_attraction["transport"],
					"mrt" : result_attraction["mrt"],
					"lat" : result_attraction["lat"],
					"lng" : result_attraction["lng"],
					"images" : image
				}
			}
			response = make_response(jsonify(response_json),200)
			return response 
		else:
			response_error={
				"error": True,
				"message": "景點編號不正確"
			}
			response=make_response(jsonify(response_error), 400)
			return response
	except:
		response_error={
			"error": True,
			"message": "伺服器內部錯誤"
		}
		response=make_response(jsonify(response_error), 500)
		return response
	finally:
		cursor.close()
		connection_object.close()