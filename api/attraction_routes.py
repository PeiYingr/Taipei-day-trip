from flask import Blueprint, request, make_response, jsonify
from model.attraction import Attraction
attractions= Blueprint("attractions",__name__)

# 取得景點資料列表
@attractions.route("/api/attractions")
def show_attractions():
	try:
		page = request.args.get("page", 0)
		keyword = request.args.get("keyword")
		page=int(page)
		attraction_list=[]
		if keyword == None:
			result = Attraction.get_attraction_information(page)
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
			result = Attraction.attraction_search(page, keyword)
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

# 根據景點編號取得景點資料
@attractions.route("/api/attraction/<attractionId>")
def find_attraction(attractionId):
	try:
		attractionId = int(attractionId)
		result = Attraction.find_attraction(attractionId)
		if result:
			image = result["images"].split(",")
			response_json={
				"data":{
					"id" :result["id"], 
					"name" : result["name"],
					"category" :result["category"],
					"description" : result["description"],
					"address" : result["address"],
					"transport" : result["transport"],
					"mrt" : result["mrt"],
					"lat" : result["lat"],
					"lng" : result["lng"],
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