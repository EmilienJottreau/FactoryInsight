from mysql.connector import connect as mysql_connect
from typing import Any, Iterable, List, Union
from opc_tags import OPC_Tag


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
                print(f"Connection to '{database_name}' database completed successfully")

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

    def create_table(self, station: str, table: str) -> None:
        try:
            self.cursor.execute(f"CREATE TABLE IF NOT EXISTS {station +'_' + table} (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL, value DOUBLE NOT NULL, timestamp TIMESTAMP)")
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

    def insert(self, station: str, table: str, tags: Union[OPC_Tag, List[OPC_Tag]]) -> Union[int, None]:
        try:
            query = f"INSERT INTO {station + '_' + table} (name, value, timestamp) VALUES (%s, %s, %s)"

            if not isinstance(tags, Iterable):
                query_values = (tags.name, tags.value, tags.timestamp)
                self.cursor.execute(query, query_values)
            else:
                query_values = []
                for tag in tags:
                    query_values.append((tag.name, tag.value, tag.timestamp))
                self.cursor.executemany(query, query_values)

            self.db.commit()
        except:
            if self.logger:
                print(f"Unable to insert tags in '{station + '_' + table}' table")
        else:
            if self.logger:
                print(f"Tags was inserted into '{station + '_' + table}' succcesfully")
            return self.cursor.lastrowid

    def update(self, station: str, table: str, tag_name: str, value: Any) -> None:
        try:
            query = f"UPDATE {station + '_' + table} SET value = %s WHERE name = %s"
            query_values = (value, tag_name)

            self.cursor.execute(query, query_values)
            self.db.commit()
        except:
            if self.logger:
                print(f"Unable to update '{tag_name}' from '{station + '_' + table}' to {value}")
        else:
            if self.logger:
                print(f"Update '{tag_name}' from '{station + '_' + table}' to {value} succcesfully")

    def delete(self, station: str, table: str, id: int) -> None:
        try:
            query = f"DELETE FROM {station + '_' + table} WHERE id = %s"
            query_values = (id,)

            self.cursor.execute(query, query_values)
            self.db.commit()
        except:
            if self.logger:
                print(f"Unable to delete id='{id}' from '{station + '_' + table}'")
        else:
            if self.logger:
                print(f"Delete '{id}' from '{station + '_' + table}' succcesfully")

    def select(self, station: str, table: str) -> List[dict]:
        response = []
        try:
            query = f"SELECT id, name, value, timestamp FROM {station + '_' + table}"

            self.cursor.execute(query)

            for id, name, value, timestamp in self.cursor.fetchall():
                response.append({"id": id, "name": name, "value": value, "timestamp": str(timestamp)})
        except:
            if self.logger:
                print(f"Unable to select tags from '{station + '_' + table}'")
        else:
            if self.logger:
                print(f"Select {len(response)} tag(s) from '{station + '_' + table}'")
        return response

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
    database.insert("station1", "table1", [OPC_Tag("tag1", 1)])
    tag2 = OPC_Tag("tag2", 2)
    tag3 = OPC_Tag("tag3", 3)
    database.insert("station1", "table1", [tag2, tag3])
    database.update("station1", "table1", tag2.name, 20)
    database.delete("station1", "table1", 3)
    result = database.select("station1", "table1")
    database.drop_database("mydatabase")
