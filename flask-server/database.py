from mysql.connector import connect
from opc_tags import OPC_Tag
from typing import Any


class Database:
    def __init__(self, database_name, recreate_db=False, logger=False) -> None:
        self.logger = logger
        self.connect(database_name, recreate_db)

    def connect(self, database_name: str, recreate_database: bool) -> None:
        try:
            self.db = connect(host="localhost", user="root", password="", database="")
            self.cursor = self.db.cursor()

            self.create_database(database_name)
            self.cursor.execute(f"USE {database_name}")

            if recreate_database:
                print("on recrer la db")
                self.drop_database(database_name)
                self.create_database(database_name)
        except:
            raise Exception("Can't connect to MySQL server")
        else:
            if self.logger:
                print(f"Connected succcesfully to '{database_name}' database")

    def create_database(self, database_name: str) -> None:
        try:
            self.cursor.execute("SHOW DATABASES")
            if database_name.casefold() not in [db[0] for db in self.cursor.fetchall()]:
                print("la db n'existe pas")
                self.cursor.execute(f"CREATE DATABASE {database_name} DEFAULT CHARACTER SET 'utf8'")
            else:
                print("erreur create db")
                raise Exception
        except:
            if self.logger:
                print(f"Unable to create '{database_name}' database")
        else:
            if self.logger:
                print(f"'{database_name}' database was created succcesfully")

    def drop_database(self, database_name: str) -> None:
        try:
            self.cursor.execute(f"DROP DATABASE {database_name}")
        except:
            if self.logger:
                print(f"Unable to drop '{database_name}' database")
        else:
            if self.logger:
                print(f"'{database_name}' database was dropped succcesfully")

    def create_table(self, station:str, table: str) -> None:
        try:
            self.cursor.execute("SHOW TABLES")
            station = station + "_" + table
            if station.casefold() not in [db[0] for db in self.cursor.fetchall()]:
                self.cursor.execute(
                    f"CREATE TABLE {station + "_" + table} (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL, value DOUBLE NOT NULL, quality TINYINT UNSIGNED, timestamp TIMESTAMP)"
                )
            else:
                print("erreur create table")
                raise Exception
        except:
            if self.logger:
                print(f"Unable to create '{station + "_" + table}' table")
        else:
            if self.logger:
                print(f"'{station + "_" + table}' table was created succcesfully")

    def drop_table(self, station:str, table: str) -> None:
        try:
            self.cursor.execute(f"DROP TABLE {station + "_" + table}")
        except:
            if self.logger:
                print(f"Unable to drop '{station + "_" + table}' table")
        else:
            if self.logger:
                print(f"'{station + "_" + table}' table was dropped succcesfully")

    def insert(self, station:str, table: str, tags: list[OPC_Tag]) -> None:
        try:
            query = f"INSERT INTO {station + "_" + table} (name, value, quality, timestamp) VALUES (%s, %s, %s, %s)"

            if len(tags) <= 1:
                query_values = (tags[0].name, tags[0].value, tags[0].quality, tags[0].timestamp)
                self.cursor.execute(query, query_values)
            else:
                query_values = []
                for tag in tags:
                    query_values.append((tag.name, tag.value, tag.quality, tag.timestamp))
                self.cursor.executemany(query, query_values)

            self.db.commit()
        except:
            if self.logger:
                print(f"Unable to insert tags in '{station + "_" + table}' table")
        else:
            if self.logger:
                print(f"Tags was inserted into '{station + "_" + table}' succcesfully")

    def update(self, station:str, table: str, tag_name: str,  value: Any) -> None:
        try:
            query = f"UPDATE {station + "_" + table} SET value = %s WHERE name = %s"
            query_values = (value, tag_name)

            self.cursor.execute(query, query_values)
            self.db.commit()
        except:
            if self.logger:
                print(f"Unable to update '{tag_name}' from '{station + "_" + table}' to {value}")
        else:
            if self.logger:
                print(f"'{tag_name}' was updated from '{station + "_" + table}' to {value} succcesfully")

    def delete(self, station:str, table: str, id: int) -> None:
        try:
            query = f"DELETE FROM {station + "_" + table} WHERE id = %s"
            query_values = (id,)

            self.cursor.execute(query, query_values)
            self.db.commit()
        except:
            if self.logger:
                print(f"Unable to delete id='{id}' from '{station + "_" + table}'")
        else:
            if self.logger:
                print(f"'{id}' was deleted from '{station + "_" + table}' succcesfully")

    def select(self, station:str, table: str) -> list[dict]:
        response = []
        try:
            query = f"SELECT id, name, value, quality, timestamp FROM {station + "_" + table}"

            self.cursor.execute(query)

            for id, name, value, quality, timestamp in self.cursor.fetchall():
                response.append({"id": id, "name": name, "value": value, "quality": quality, "timestamp": timestamp})
        except:
            if self.logger:
                print(f"Unable to select tags from '{station + "_" + table}'")
        else:
            if self.logger:
                print(f"{len(response)} tag(s) was selected from '{station + "_" + table}'")
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
    database.insert("station1","table1", [OPC_Tag("tag1", 1)])
    tag2 = OPC_Tag("tag2", 2)
    tag3 = OPC_Tag("tag3", 3)
    database.insert("station1","table1", [tag2, tag3])
    database.update("station1","table1", tag2.name, 20)
    database.delete("station1","table1", 3)
    result = database.select("station1","table1")
    database.drop_database("mydatabase")
