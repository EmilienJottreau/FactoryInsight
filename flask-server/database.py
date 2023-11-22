import mysql.connector as db
from datetime import datetime

try:
    database = db.connect(user="user", password="password", host="127.0.0.1", database="opc_tags")
except db.connector.Error as err:
    if err.errno == db.errorcode.ER_ACCESS_DENIED_ERROR:
        print("Something is wrong with your user name or password")
    elif err.errno == db.errorcode.ER_BAD_DB_ERROR:
        print("Database does not exist")
    else:
        print(err)
else:
    database.close()

# CREATE TABLE

DB_NAME = "opc_tags"

TABLES = {}
TABLES["tags"] = (
    "CREATE TABLE `tags` ("
    "  `name` varchar(255) NOT NULL,"
    "  `value` double NOT NULL,"
    "  `timestamp` timestamp NOT NULL,"
    "  PRIMARY KEY (`name`)"
    ") ENGINE=InnoDB")

cursor = database.cursor()


def create_database(cursor):
    try:
        cursor.execute("CREATE DATABASE {} DEFAULT CHARACTER SET 'utf8'".format(DB_NAME))
    except db.Error as err:
        print("Failed creating database: {}".format(err))
        exit(1)


try:
    cursor.execute("USE {}".format(DB_NAME))
except db.Error as err:
    print("Database {} does not exists.".format(DB_NAME))
    if err.errno == db.errorcode.ER_BAD_DB_ERROR:
        create_database(cursor)
        print("Database {} created successfully.".format(DB_NAME))
        database.database = DB_NAME
    else:
        print(err)
        exit(1)

for table_name in TABLES:
    table_description = TABLES[table_name]
    try:
        print("Creating table {}: ".format(table_name), end="")
        cursor.execute(table_description)
    except db.Error as err:
        if err.errno == db.errorcode.ER_TABLE_EXISTS_ERROR:
            print("already exists.")
        else:
            print(err.msg)
    else:
        print("OK")


# INSERT

add_tag = "INSERT INTO tags " "(name, value, timestamp) VALUES (%s, %s, %s)"

data_tag = ("Tag1", "25", datetime.now().timestamp())


cursor.execute(add_tag, data_tag)

database.commit()


# SELECT

query = "SELECT name, value, timestamp FROM tags"

cursor.execute(query)

for name, value, timestamp in cursor:
    print(f"The tag {name} is equal to {value} and was updated at {timestamp}")

cursor.close()
database.close()
