import model.database

class Category:
    def category_search():
        try:
            connection_object = model.database.database_connect()
            cursor =  connection_object.cursor()
            # 使用 DISTINCT 過濾掉重複的資料
            category_search="SELECT DISTINCT category FROM attractions"
            cursor.execute(category_search)
            result_category = cursor.fetchall()
            return result_category 
            # set(result_category) 
            # 若資料庫過濾重複資料無使用 DISTINCT，也可使用 set 集合來過濾掉重複的資料
        finally:
            cursor.close()
            connection_object.close()