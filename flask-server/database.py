from mysql.connector import connect
from typing import Any, Callable
from opc_tags import OPC_Tag


class Database:
    callback_function = None

    def __init__(self, database_name="", recreate_db=False, logger=False) -> None:
        self.logger = logger
        self.connect(database_name, recreate_db)

    def connect(self, database_name: str, recreate_database: bool) -> None:
        try:
            self.db = connect(host="localhost", user="root", password="", database="")
            self.cursor = self.db.cursor()

            if database_name:
                if recreate_database:
                    self.drop_database(database_name)
                self.cursor.execute("SHOW DATABASES")

                if database_name.casefold() not in [db[0] for db in self.cursor.fetchall()]:
                    self.create_database(database_name)
                self.cursor.execute(f"USE {database_name}")
        except:
            if self.logger:
                print(f"Unable to connect to '{database_name}' database")
            return Exception
        else:
            if self.logger:
                print(f"Connected succcesfully to '{database_name}' database")

    def callback(function: Callable):
        def wrapper(self, *args, **kwargs):
            try:
                Database.callback_function(function.__name__, *args)
            except:
                print(f"No callback function defined")
            else:
                print(f"Callback received from '{function.__name__}' function")
            return function(self, *args, **kwargs)

        return wrapper

    def create_database(self, database_name: str) -> None:
        try:
            self.cursor.execute(f"CREATE DATABASE {database_name} DEFAULT CHARACTER SET 'utf8'")
            self.cursor.execute(f"USE {database_name}")
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

    def create_table(self, table_name: str) -> None:
        try:
            self.cursor.execute(
                f"CREATE TABLE {table_name} (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL, value DOUBLE NOT NULL, quality TINYINT UNSIGNED, timestamp TIMESTAMP)"
            )
        except:
            if self.logger:
                print(f"Unable to create '{table_name}' table")
        else:
            if self.logger:
                print(f"'{table_name}' table was created succcesfully")

    def drop_table(self, table_name: str) -> None:
        try:
            self.cursor.execute(f"DROP TABLE {table_name}")
        except:
            if self.logger:
                print(f"Unable to drop '{table_name}' table")
        else:
            if self.logger:
                print(f"'{table_name}' table was dropped succcesfully")

    @callback
    def insert(self, table_name: str, tags: list[OPC_Tag]) -> None:
        try:
            query = f"INSERT INTO {table_name} (name, value, quality, timestamp) VALUES (%s, %s, %s, %s)"

            if len(tags) <= 1:
                query_value = (tags[0].name, tags[0].value, tags[0].quality, tags[0].timestamp)
                self.cursor.execute(query, query_value)
            else:
                query_values = []
                for tag in tags:
                    query_values.append((tag.name, tag.value, tag.quality, tag.timestamp))
                self.cursor.executemany(query, query_values)

            self.db.commit()
        except:
            if self.logger:
                print(f"Unable to insert tags in '{table_name}' table")
        else:
            if self.logger:
                print(f"Tags was inserted into '{table_name}' succcesfully")

    @callback
    def update(self, table_name: str, tag_name: str, value: Any) -> None:
        try:
            query = f"UPDATE {table_name} SET value = %s WHERE name = %s"
            query_value = (value, tag_name)

            self.cursor.execute(query, query_value)
            self.db.commit()
        except:
            if self.logger:
                print(f"Unable to update '{tag_name}' from '{table_name}' to {value}")
        else:
            if self.logger:
                print(f"'{tag_name}' was updated from '{table_name}' to {value} succcesfully")

    @callback
    def delete(self, table_name: str, id: int) -> None:
        try:
            query = f"DELETE FROM {table_name} WHERE id = %s"
            query_value = (id,)

            self.cursor.execute(query, query_value)
            self.db.commit()
        except:
            if self.logger:
                print(f"Unable to delete id='{id}' from '{table_name}'")
        else:
            if self.logger:
                print(f"'{id}' was deleted from '{table_name}' succcesfully")

    def select(self, table_name: str) -> list[dict]:
        response = []
        try:
            query = f"SELECT id, name, value, quality, timestamp FROM {table_name}"

            self.cursor.execute(query)

            for id, name, value, quality, timestamp in self.cursor.fetchall():
                response.append({"id": id, "name": name, "value": value, "quality": quality, "timestamp": timestamp})
        except:
            if self.logger:
                print(f"Unable to select tags from '{table_name}'")
        else:
            if self.logger:
                print(f"{len(response)} tag(s) was selected from '{table_name}'")
        return response

    def __del__(self) -> None:
        try:
            self.db.close()
        except:
            pass


if __name__ == "__main__":
    database = Database("mydatabase", logger=True)
    database.drop_database("mydatabase")
    database.create_database("mydatabase")
    database.create_table("table1")
    database.drop_table("table1")
    database.create_table("table2")
    database.insert("table2", [OPC_Tag("tag1", 1)])
    tag2 = OPC_Tag("tag2", 2)
    tag3 = OPC_Tag("tag3", 3)
    database.insert("table2", [tag2, tag3])
    database.update("table2", tag2, 20)
    database.delete("table2", tag3)
    res = database.select("table2")
    database.drop_database("mydatabase")
