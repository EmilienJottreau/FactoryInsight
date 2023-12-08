from flask import Flask, render_template
import database as db1

app = Flask(__name__, static_folder=".", static_url_path="")

db = db1.DataBase()
db.create("opc_tags")

try:
    tag1 = db1.Tag("Tag1", 44)
    db.insert(tag1)
except Exception as e:
    print(e)

try:
    tag2 = db1.Tag("Tag2", 788)
    db.insert(tag2)
except Exception as e:
    print(e)

response = db.select()


@app.route("/")
def index():
    return render_template("index.html", data=response)


@app.route("/members")
def members():
    return {"members": ["Member1", "Member2", "Member3"]}


if __name__ == "__main__":
    app.run(port=8080, debug=True)
