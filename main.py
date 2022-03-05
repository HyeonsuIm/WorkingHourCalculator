from flask import Flask, abort, render_template, request
import holidays

app = Flask(__name__, static_url_path='/static')

@app.route("/")
def show_main_view():
    #get_holiday_lists(2022)
    return render_template('html/main.html')

def get_holiday_lists(year):
    return holidays.KR()

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=20000)