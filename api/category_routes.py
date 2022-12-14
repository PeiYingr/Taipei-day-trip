from flask import Blueprint, make_response, jsonify
import mysql.connector

categories = Blueprint("categories", __name__)
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

# 取得景點分類名稱列表
@categories.route("/api/categories")
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