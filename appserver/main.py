"""Web server main"""
from logging import basicConfig, info, INFO

from datetime import datetime
from flask import Flask, render_template, request
from holidays import KR

app = Flask(__name__, static_url_path='/static')
basicConfig(level=INFO)

@app.route("/")
def show_main_view():
    """ rendering main page"""
    date = datetime.now()
    holidays = get_holiday_lists(date.year)
    info("* access user %s", request.remote_addr)
    return render_template('html/main.html', data=holidays)

@app.route("/WorkingHourInput.html")
def show_working_hour_input():
    """ rendering working hour input page"""
    return render_template('html/WorkingHourInput.html')

def get_holiday_lists(year):
    """ Get holidays"""
    return list(KR(years=year).keys())

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=20000)
