"""Web server main"""
from datetime import datetime
from flask import Flask, render_template
from holidays import KR

app = Flask(__name__, static_url_path='/static')

@app.route("/")
def show_main_view():
    """ rendering main page"""
    date = datetime.now()
    holidays = get_holiday_lists(date.year)
    #print(holidays)
    return render_template('html/main.html', data=holidays)

def get_holiday_lists(year):
    """ Get holidays"""
    return list(KR(years=year).keys())

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=20000)
