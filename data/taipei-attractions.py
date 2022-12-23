import json
import mysql.connector
import mysql.connector
from  dotenv import load_dotenv
import os

load_dotenv()
database_password=os.getenv("database_password")
database_user=os.getenv("database_user")

taipei_attractions=mysql.connector.connect(user=database_user, 
                                password=database_password,
                                host="127.0.0.1",
                                database="taipei_attractions")
cursor=taipei_attractions.cursor()

with open("taipei-attractions.json", mode="r", encoding="utf-8") as file:
    data=json.load(file)  # 利用json模組處理json資料格式
# py把json資料讀取進來之後會是一個「字典」型態, data 是一個字典資料 
# 記得!!py把json資料讀取進來之後會是一個「字典」型態, data 是一個字典資料   
attractions=data["result"]["results"] # 擷取results下一層的列表(值)
#print(attractions)

for x in attractions:
    photo=x["file"].split("https")
    photolist=[]
    for y in photo:
        if y.endswith("JPG") or y.endswith("jpg") or y.endswith("PNG") or y.endswith("png"):
            y="https"+y
            photolist.append(y) 
    # 把列表變字串   
    photo=",".join(photolist)
    
    id=x["_id"]
    name=x["name"]
    category=x["CAT"]
    description=x["description"]
    address=x["address"]
    transport=x["direction"]
    mrt=x["MRT"]
    lat=x["latitude"]
    lng=x["longitude"]
    images=photo
    # 放入資料庫中
    add_attractions="INSERT INTO attractions (name, category, description, address, transport, mrt, lat, lng, images) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
    newdata=(name, category, description, address, transport, mrt, lat, lng, images)
    cursor.execute(add_attractions, newdata)
    taipei_attractions.commit()

cursor.close
taipei_attractions.close