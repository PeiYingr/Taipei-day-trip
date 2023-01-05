from flask import Flask, render_template
from api.attraction_routes import attractions
from api.category_routes import categories
from api.user_routes import users
from api.booking_routes import bookings
from api.order_routes import orders

app=Flask(__name__,static_folder="static", static_url_path="/")

app.register_blueprint(attractions)
app.register_blueprint(categories)
app.register_blueprint(users)
app.register_blueprint(bookings)
app.register_blueprint(orders)

app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
# 防止Flask jsonify對數據進行排序
app.config["JSON_SORT_KEYS"]=False

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
@app.route("/order")
def order():
	return render_template("order.html")	

app.run (host="0.0.0.0", port=3000)