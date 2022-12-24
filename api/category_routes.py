from flask import Blueprint, make_response, jsonify
from model.category import Category

categories = Blueprint("categories", __name__)

# 取得景點分類名稱列表
@categories.route("/api/categories")
def api_categories():
	try:
		result = Category.category_search()
		catlist=[]
		for x in result:
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