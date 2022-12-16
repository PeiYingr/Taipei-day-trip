from flask import Blueprint, make_response, jsonify
from api.connection import connection_pool

categories = Blueprint("categories", __name__)

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