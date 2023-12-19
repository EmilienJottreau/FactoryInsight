import mysql.connector as mysql
import datetime
from typing import Any, List

class Tag:
    def __init__(
        self,
        name,
        value,
        timestamp=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    ) -> None:
        self.name = name
        self.value = value
        self.timestamp = timestamp

    def __str__(self) -> str:
        return f"{self.name} is equal to {self.value} at {self.timestamp}"


class DataBase:
    def __init__(self, database = "") -> None:
        try:
            self.database = mysql.connect(user="root", password="", host="localhost", database=database)
            self.cursor = self.database.cursor()
        except Exception as err:
            if err.errno == mysql.errorcode.ER_ACCESS_DENIED_ERROR:
                print("User name or password is wrong")
            elif err.errno == mysql.errorcode.ER_BAD_DB_ERROR:
                print("Database does not exist")
            else:
                print(err)

    def get_databases(self):
        self.cursor.execute("SHOW DATABASES")

        databases = []
        for database in self.cursor:
            databases.append(database)
        return databases

    def create_database(self, database_name: str):
        try:
            self.cursor.execute("USE {}".format(database_name))
        except mysql.Error as err:
            print("Database {} does not exists.".format(database_name))
            if err.errno == mysql.errorcode.ER_BAD_DB_ERROR:
                try:
                    self.cursor.execute("CREATE DATABASE {} DEFAULT CHARACTER SET 'utf8'".format(database_name))
                except mysql.Error as err:
                    print("Failed creating database: {}".format(err))
                    exit(1)
                print("Database {} created successfully.".format(database_name))
                self.database.database = database_name
            else:
                print(err)
                exit(1)

    def create_table(self):
        TABLES = {}
        TABLES["tags"] = (
            "CREATE TABLE `tags` (" "  `name` varchar(255) NOT NULL," "  `value` double NOT NULL," "  `timestamp` timestamp NOT NULL," "  PRIMARY KEY (`name`)" ") ENGINE=InnoDB"
        )

        for table_name in TABLES:
            table_description = TABLES[table_name]
            try:
                print("Creating table {}: ".format(table_name), end="")
                self.cursor.execute(table_description)
            except mysql.Error as err:
                if err.errno == mysql.errorcode.ER_TABLE_EXISTS_ERROR:
                    print("already exists.")
                else:
                    print(err.msg)
            else:
                print("OK")

    def insert(self, tags: list):
        add_tag = "INSERT INTO tags " "(name, value, timestamp) VALUES (%s, %s, %s)"

        if len(tags) == 1:
            data_tag = (tags[0].name, tags[0].value, tags[0].timestamp)
            self.cursor.execute(add_tag, data_tag)
        else:
            data_tag = []
            for tag in tags:
                data_tag.append((tag.name, tag.value, tag.timestamp))
            self.cursor.executemany(add_tag, data_tag)

        self.database.commit()

    def select(self):
        query = "SELECT name, value, timestamp FROM tags"

        self.cursor.execute(query)
        #myresult = self.cursor.fetchall()
        response = []
        for name, value, timestamp in self.cursor:
            print(f"The tag {name} is equal to {value} and was updated at {timestamp}")
            response.append({"name": name, "value": value, "timestamp": timestamp})
        return response
    
    def update(self, tag:Tag, value):
        query = "UPDATE tags SET value = %s WHERE name = %s"
        arg = (value, tag.name)

        self.cursor.execute(query, arg)

        self.database.commit()

    def delete(self, tag: Tag):
        delete = "DELETE FROM tags WHERE name = %s"
        arg = tag.name

        self.cursor.execute(delete, arg)
        self.database.commit()

    def __del__(self):
        self.cursor.close()
        self.database.close()
