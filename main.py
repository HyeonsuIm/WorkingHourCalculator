from flask import Flask, abort, render_template, request
import datetime
import holidays

app = Flask(__name__, static_url_path='/static')

@app.route("/")
def show_main_view():
    date = datetime.datetime.now()
    holidays = get_holiday_lists(date.year)
    #print(holidays)
    return render_template('html/main.html', data=holidays)

def get_holiday_lists(year):
    return list(holidays.KR(years=year).keys())

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=20000)