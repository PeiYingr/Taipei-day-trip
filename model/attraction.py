from model.database import connection_pool

class Attraction:
    def get_attraction_information(page):
        try:
            connection_object = connection_pool.get_connection()
            cursor = connection_object.cursor(dictionary=True)
            attraction = "SELECT * FROM attractions limit %s, 13"
            cursor.execute(attraction,(page*12,))
            result=cursor.fetchall()    
            return result  
        finally:
            cursor.close()
            connection_object.close()

    def attraction_search(page, keyword): 
        try:
            connection_object = connection_pool.get_connection()
            cursor = connection_object.cursor(dictionary=True)
            attraction_search="SELECT * FROM attractions WHERE category=%s OR name LIKE %s LIMIT %s, 13"
            value=(keyword, f"%{keyword}%", page*12)
            # 也可使用 "%"+f"{keyword}"+"%"、"%"+keyword +"%" 
            cursor.execute(attraction_search, value)
            result = cursor.fetchall()
            return result 
        finally:
            cursor.close()
            connection_object.close()

    def find_attraction(attractionId):
        try:
            connection_object = connection_pool.get_connection()
            cursor = connection_object.cursor(dictionary=True)
            id_search="SELECT * FROM attractions WHERE id = %s"
            cursor.execute(id_search, (attractionId,))
            result = cursor.fetchone()
            return result
        finally:
            cursor.close()
            connection_object.close()
    