from flask import Flask, abort, render_template, request

app = Flask(__name__, static_url_path='/static')

@app.route("/")
def ShowManView():
    return render_template('html/main.html')

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=20000)