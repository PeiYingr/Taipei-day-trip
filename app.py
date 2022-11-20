from flask import *
import mysql.connector

app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
# 防止Flask jsonify對數據進行排序
app.config["JSON_SORT_KEYS"]=False

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

# Pages
@app.route("/")
def index():
	return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")


# 取得景點資料列表
@app.route("/api/attractions")
def attractions():
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
@app.route("/api/attraction/<attractionId>")
def api_attraction(attractionId):
	try:
		attractionId = int(attractionId)
		connection_object = connection_pool.get_connection()
		cursor =  connection_object.cursor()
		id_search="SELECT * FROM attractions WHERE id = %s"
		cursor.execute(id_search, (attractionId,))
		result_attraction = cursor.fetchone()
		if result_attraction:
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
								"images" :[
									result_attraction[9]
								]
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


# 取得景點分類名稱列表
@app.route("/api/categories")
def api_categories():
	try:
		connection_object = connection_pool.get_connection()
		cursor =  connection_object.cursor()
		# 使用 DISTINCT 過濾掉重複的資料
		category_search="SELECT DISTINCT category FROM attractions"
		cursor.execute(category_search)
		result_category = cursor.fetchall()
		# set(result_category) 
		# 若資料庫過濾重複資料無使用 DISTINCT，也可使用 set 集合來過濾掉重複的資料
		catlist=[]
		for x in result_category:
			catlist.append(x[0])

		response_json={
						"data": catlist
					}
		response = make_response(jsonify(response_json),200)
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

app.run (host="0.0.0.0", port=3000)