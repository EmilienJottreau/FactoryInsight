from mysql.connector import connect as mysql_connect
from opc_tags import OPC_Data
from typing import Any


class Database:
    def __init__(self, database_name: str, recreate_db: bool = False, logger: bool = False) -> None:
        self.logger = logger
        self.connect(database_name, recreate_db)

    def connect(self, database_name: str, recreate_database: bool) -> None:
        try:
            self.db = mysql_connect(host="localhost", user="root", password="", database="")
            self.cursor = self.db.cursor()

            self.create_database(database_name)
            if recreate_database:
                self.drop_database(database_name)
                self.create_database(database_name)

            self.cursor.execute(f"USE {database_name}")
        except:
            raise Exception("Unable to connect to MySQL database, please check XAMPP module status")
        else:
            if self.logger:
                print(f"Connected to '{database_name}' database successfully")

    def create_database(self, database_name: str) -> None:
        try:
            self.cursor.execute(f"CREATE DATABASE IF NOT EXISTS {database_name} DEFAULT CHARACTER SET 'utf8'")
        except:
            if self.logger:
                print(f"Unable to create '{database_name}' database")
        else:
            if self.logger:
                print(f"Database '{database_name}' was created succcesfully")

    def drop_database(self, database_name: str) -> None:
        try:
            self.cursor.execute(f"DROP DATABASE {database_name}")
        except:
            if self.logger:
                print(f"Unable to drop '{database_name}' database")
        else:
            if self.logger:
                print(f"Database '{database_name}' was dropped succcesfully")

    def create_table(self, station: str, tag: str, tag_type: str) -> None:
        try:
            self.cursor.execute(f"CREATE TABLE IF NOT EXISTS {station +'_' + tag} (id INT AUTO_INCREMENT PRIMARY KEY, value {tag_type} NOT NULL, timestamp TIMESTAMP NOT NULL)")
        except:
            if self.logger:
                print(f"Unable to create '{station + '_' + tag}' table")
        else:
            if self.logger:
                print(f"Table '{station + '_' + tag}' was created succcesfully")

    def drop_table(self, station: str, tag: str) -> None:
        try:
            self.cursor.execute(f"DROP TABLE {station + '_' + tag}")
        except:
            if self.logger:
                print(f"Unable to drop '{station + '_' + tag}' table")
        else:
            if self.logger:
                print(f"Table '{station + '_' + tag}' was dropped succcesfully")

    def insert(self, station: str, tag_name: str, tag_data: dict) -> int | None:
        try:
            query = f"INSERT INTO {station + '_' + tag_name} (value, timestamp) VALUES (%s, %s)"
            query_values = (tag_data["value"], tag_data["timestamp"])

            self.cursor.execute(query, query_values)
            self.db.commit()
        except:
            if self.logger:
                print(f"Unable to insert tags in '{station + '_' + tag_name}' table")
        else:
            if self.logger:
                print(f"Tag was inserted into '{station + '_' + tag_name}' succcesfully")
            return self.cursor.lastrowid

    def update(self, station: str, tag: str, id: int, value: Any) -> None:
        try:
            query = f"UPDATE {station + '_' + tag} SET value = %s WHERE id = %s"
            query_values = (value, id)

            self.cursor.execute(query, query_values)
            self.db.commit()
        except:
            if self.logger:
                print(f"Unable to update '{id}' from '{station + '_' + tag}' to {value}")
        else:
            if self.logger:
                print(f"Update '{id}' from '{station + '_' + tag}' to {value} succcesfully")

    def delete(self, station: str, tag: str, id: int) -> None:
        try:
            query = f"DELETE FROM {station + '_' + tag} WHERE id = %s"
            query_values = (id,)

            self.cursor.execute(query, query_values)
            self.db.commit()
        except:
            if self.logger:
                print(f"Unable to delete '{id}' from '{station + '_' + tag}'")
        else:
            if self.logger:
                print(f"Delete '{id}' from '{station + '_' + tag}' succcesfully")

    def select(self, station: str, tag: str, limit: int = None) -> list[dict]:
        response = []
        try:
            if limit:
                query = f"SELECT id, value, timestamp FROM {station + '_' + tag} ORDER BY timestamp DESC LIMIT {limit}"
            else:
                query = f"SELECT id, value, timestamp FROM {station + '_' + tag}"

            self.cursor.execute(query)

            for id, value, timestamp in self.cursor.fetchall():
                response.append(OPC_Data(station, tag, value, timestamp, id).json)
        except:
            if self.logger:
                print(f"Unable to select tags from '{station + '_' + tag}'")
        else:
            if self.logger:
                print(f"Select {len(response)} tag(s) from '{station + '_' + tag}'")
        return response

    def __del__(self) -> None:
        try:
            self.db.close()
        except:
            pass


if __name__ == "__main__":
    database = Database("mydatabase", logger=True, recreate_db=False)
    database.create_table("station1", "table1", "bool")
    database.create_table("station1", "table2", "float")
    database.drop_table("station1", "table2")
    database.insert("station1", "table1", {"value": 1, "timestamp": ""})
    database.insert("station1", "table1", {"value": 2, "timestamp": ""})
    database.update("station1", "table1", 2, 20)
    database.delete("station1", "table1", 2)
    print(database.select("station1", "table1"))
    database.drop_database("mydatabase")
