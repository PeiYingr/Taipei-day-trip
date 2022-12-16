import mysql.connector
from  dotenv import load_dotenv
import os

load_dotenv() # take enviroment variables from .env
database_password=os.getenv("database_password")

taipei_attractions = {
    "user":"root",
    "password":database_password,
    "host":"127.0.0.1",
    "database":"taipei_attractions",
}
# create connection pool
connection_pool = mysql.connector.pooling.MySQLConnectionPool(
    pool_name = "taipei_attractions",
    pool_size = 10,
    **taipei_attractions
)