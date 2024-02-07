from mysql.connector import connect as mysql_connect
from typing import Any, Dict, List, Union


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

    def create_table(self, station: str, table: str, typ: bool) -> None:
        try:
            if typ:
                self.cursor.execute(f"CREATE TABLE IF NOT EXISTS {station +'_' + table} (id INT AUTO_INCREMENT PRIMARY KEY, value FLOAT NOT NULL, timestamp TIMESTAMP)")
            else:
                self.cursor.execute(f"CREATE TABLE IF NOT EXISTS {station +'_' + table} (id INT AUTO_INCREMENT PRIMARY KEY, value BOOL NOT NULL, timestamp TIMESTAMP)")
        except:
            if self.logger:
                print(f"Unable to create '{station + '_' + table}' table")
        else:
            if self.logger:
                print(f"Table '{station + '_' + table}' was created succcesfully")

    def drop_table(self, station: str, table: str) -> None:
        try:
            self.cursor.execute(f"DROP TABLE {station + '_' + table}")
        except:
            if self.logger:
                print(f"Unable to drop '{station + '_' + table}' table")
        else:
            if self.logger:
                print(f"Table '{station + '_' + table}' was dropped succcesfully")

    def insert(self, station: str, table: str, tags: Union[Dict, List]) -> Union[int, None]:
        try:
            query = f"INSERT INTO {station + '_' + table} (value, timestamp) VALUES (%s, %s)"

            if not isinstance(tags, List):
                query_values = (tags["value"], tags["timestamp"])
                self.cursor.execute(query, query_values)
            else:
                query_values = []
                for tag in tags:
                    query_values.append((tag["value"], tag["timestamp"]))
                self.cursor.executemany(query, query_values)

            self.db.commit()
        except:
            if self.logger:
                print(f"Unable to insert tags in '{station + '_' + table}' table")
        else:
            if self.logger:
                print(f"Tags was inserted into '{station + '_' + table}' succcesfully")
            return self.cursor.lastrowid

    def update(self, station: str, table: str, id: int, value: Any) -> None:
        try:
            query = f"UPDATE {station + '_' + table} SET value = %s WHERE id = %s"
            query_values = (value, id)

            self.cursor.execute(query, query_values)
            self.db.commit()
        except:
            if self.logger:
                print(f"Unable to update '{id}' from '{station + '_' + table}' to {value}")
        else:
            if self.logger:
                print(f"Update '{id}' from '{station + '_' + table}' to {value} succcesfully")

    def delete(self, station: str, table: str, id: int) -> None:
        try:
            query = f"DELETE FROM {station + '_' + table} WHERE id = %s"
            query_values = (id,)

            self.cursor.execute(query, query_values)
            self.db.commit()
        except:
            if self.logger:
                print(f"Unable to delete '{id}' from '{station + '_' + table}'")
        else:
            if self.logger:
                print(f"Delete '{id}' from '{station + '_' + table}' succcesfully")

    def select(self, station: str, table: str, limit: int = None) -> List[dict]:
        response = []
        try:
            if limit:
                query = f"SELECT id, value, timestamp FROM {station + '_' + table} ORDER BY timestamp DESC LIMIT {limit}"
            else:
                query = f"SELECT id, value, timestamp FROM {station + '_' + table}"

            self.cursor.execute(query)

            for id, value, timestamp in self.cursor.fetchall():
                response.append({"id": id, "value": value, "timestamp": str(timestamp)})
        except:
            if self.logger:
                print(f"Unable to select tags from '{station + '_' + table}'")
        else:
            if self.logger:
                print(f"Select {len(response)} tag(s) from '{station + '_' + table}'")
        return response

    def reset(self) -> None:
        self.cursor.execute("SHOW TABLES")

        for table in self.cursor:
            station, table = table[0].split("_")
            self.drop_table(station, table)
            self.create_table(station, table)

    def __del__(self) -> None:
        try:
            self.db.close()
        except:
            pass


if __name__ == "__main__":
    database = Database("mydatabase", logger=True, recreate_db=False)
    database.create_table("station1", "table1")
    database.create_table("station1", "table2")
    database.drop_table("station1", "table2")
    database.insert("station1", "table1", {"value": 1, "timestamp": ""})
    database.insert("station1", "table1", [{"value": 2, "timestamp": ""}, {"value": 3, "timestamp": ""}])
    database.update("station1", "table1", "tag2", 20)
    database.delete("station1", "table1", 1)
    result = database.select("station1", "table1")
    database.reset()
    database.drop_database("mydatabase")
