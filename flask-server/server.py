from flask import Flask, render_template
import database as db1
import random as rd

app = Flask(__name__, static_folder=".", static_url_path="")

try:
    db = db1.DataBase()
    db.create_database("opc_tags")
    db.create_table()
    tag1 = db1.Tag("Tag1", 44)
    db.insert(tag1)
    db.update(tag1, 42)
    tag2 = db1.Tag("Tag2", 788)
    db.insert(tag2)
except Exception as e:
    print(e)

def up():
    db.update(tag1, rd.randint(0, 100))
    return db.select()

try:
    response = up()
except Exception as e:
    response = [{"name": "Error", "value": 0, "timestamp": "00/00"}]
    print(e)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/data")
def data():
    return render_template("data.html", data=response)


@app.route("/update")
def update():
    response = up()
    return render_template("data.html", data=response)


@app.route("/members")
def members():
    return {"members": ["Member1", "Member2", "Member3"]}


if __name__ == "__main__":
    app.run(port=8080, debug=False)
