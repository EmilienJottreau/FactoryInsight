import mysql.connector as db
import datetime


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
    def __init__(self) -> None:
        try:
            self.database = db.connect(
                user="root", password="", host="127.0.0.1", database=""
            )
            self.cursor = self.database.cursor()
        except Exception as err:
            print(err)
            if err.errno == db.errorcode.ER_ACCESS_DENIED_ERROR:
                print("Something is wrong with your user name or password")
            elif err.errno == db.errorcode.ER_BAD_DB_ERROR:
                print("Database does not exist")
            else:
                print(err)

    def initialization(self):
        # CREATE TABLE
        DB_NAME = "opc_tags"

        TABLES = {}
        TABLES["tags"] = (
            "CREATE TABLE `tags` ("
            "  `name` varchar(255) NOT NULL,"
            "  `value` double NOT NULL,"
            "  `timestamp` timestamp NOT NULL,"
            "  PRIMARY KEY (`name`)"
            ") ENGINE=InnoDB"
        )

        try:
            self.cursor.execute("USE {}".format(DB_NAME))
        except db.Error as err:
            print("Database {} does not exists.".format(DB_NAME))
            if err.errno == db.errorcode.ER_BAD_DB_ERROR:
                try:
                    self.cursor.execute(
                        "CREATE DATABASE {} DEFAULT CHARACTER SET 'utf8'".format(
                            DB_NAME
                        )
                    )
                except db.Error as err:
                    print("Failed creating database: {}".format(err))
                    exit(1)
                print("Database {} created successfully.".format(DB_NAME))
                self.database.database = DB_NAME
            else:
                print(err)
                exit(1)

        for table_name in TABLES:
            table_description = TABLES[table_name]
            try:
                print("Creating table {}: ".format(table_name), end="")
                self.cursor.execute(table_description)
            except db.Error as err:
                if err.errno == db.errorcode.ER_TABLE_EXISTS_ERROR:
                    print("already exists.")
                else:
                    print(err.msg)
            else:
                print("OK")

    def insert(self, tag: Tag):
        add_tag = "INSERT INTO tags " "(name, value, timestamp) VALUES (%s, %s, %s)"

        data_tag = (tag.name, tag.value, tag.timestamp)

        self.cursor.execute(add_tag, data_tag)

        self.database.commit()

    def select(self):
        query = "SELECT name, value, timestamp FROM tags"

        self.cursor.execute(query)

        response = []
        for name, value, timestamp in self.cursor:
            print(f"The tag {name} is equal to {value} and was updated at {timestamp}")
            response.append({"name": name, "value": value, "timestamp": timestamp})
        return response

    def delete(self, tag: Tag):
        delete = "DELETE FROM tags WHERE name = %s"
        arg = tag.name

        self.cursor.execute(delete, arg)
        self.database.commit()

    def __del__(self):
        self.cursor.close()
        self.database.close()
