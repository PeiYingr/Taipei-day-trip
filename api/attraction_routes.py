from flask import Blueprint, request, make_response, jsonify
import mysql.connector

attractions= Blueprint("attractions",__name__)

taipei_attractions = {
    "user":"root",
    "password":"hihi3838",
    "host":"127.0.0.1",
    "database":"taipei_attractions",
}
# create connection pool
connection_pool = mysql.connector.pooling.MySQLConnectionPool(
    pool_name = "taipei_attractions",
    pool_size = 10,
    **taipei_attractions
)

# 取得景點資料列表
@attractions.route("/api/attractions")
def show_attractions():
	try:
		connection_object = connection_pool.get_connection()
		cursor =  connection_object.cursor()
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
					image=x[9].split(",")
					response_json={
						"id" :x[0], 
						"name" : x[1],
						"category" :x[2],
						"description" : x[3],
						"address" : x[4],
						"transport" : x[5],
						"mrt" : x[6],
						"lat" : x[7],
						"lng" : x[8],
						"images" : image
					}
					attraction_list.append(response_json)
			else:
				nextpage=None
				for x in result:
					image=x[9].split(",")
					response_json={
						"id" :x[0], 
						"name" : x[1],
						"category" :x[2],
						"description" : x[3],
						"address" : x[4],
						"transport" : x[5],
						"mrt" : x[6],
						"lat" : x[7],
						"lng" : x[8],
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
					image=x[9].split(",")
					response_json={
						"id" :x[0], 
						"name" : x[1],
						"category" :x[2],
						"description" : x[3],
						"address" : x[4],
						"transport" : x[5],
						"mrt" : x[6],
						"lat" : x[7],
						"lng" : x[8],
						"images" : image
					}
					attraction_list.append(response_json)
			else:
				nextpage=None
				for x in result:
					image=x[9].split(",")
					response_json={
						"id" :x[0], 
						"name" : x[1],
						"category" :x[2],
						"description" : x[3],
						"address" : x[4],
						"transport" : x[5],
						"mrt" : x[6],
						"lat" : x[7],
						"lng" : x[8],
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
		cursor =  connection_object.cursor()
		id_search="SELECT * FROM attractions WHERE id = %s"
		cursor.execute(id_search, (attractionId,))
		result_attraction = cursor.fetchone()
		if result_attraction:
			image = result_attraction[9].split(",")
			response_json={
				"data":{
					"id" :result_attraction[0], 
					"name" : result_attraction[1],
					"category" :result_attraction[2],
					"description" : result_attraction[3],
					"address" : result_attraction[4],
					"transport" : result_attraction[5],
					"mrt" : result_attraction[6],
					"lat" : result_attraction[7],
					"lng" : result_attraction[8],
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