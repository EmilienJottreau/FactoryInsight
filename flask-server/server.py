from flask import Flask, render_template

app = Flask(__name__, static_folder=".", static_url_path="")


@app.route("/")
def index():
    data = {"name": "Tag1", "value": "25", "time": "12h"}
    return render_template("index.html", data=data)


@app.route("/members")
def members():
    return {"members": ["Member1", "Member2", "Member3"]}


if __name__ == "__main__":
    app.run(port=8080, debug=True)
