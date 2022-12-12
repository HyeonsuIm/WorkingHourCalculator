"""Web server main"""
from logging import basicConfig, info, INFO

from datetime import datetime
from flask import Flask, render_template, request, flash, url_for, redirect, make_response, jsonify
from json import loads
from sqlalchemy import create_engine
from holidays import KR

from flaskServer.Database.User import User
from flaskServer.Database.Logging import Logging
from flaskServer.Database.UserWorking import UserWorking

app = Flask(__name__, static_url_path='/static')
app.config.from_pyfile("config.py")
app.secret_key = 'super secret key'
app.config['SESSION_TYPE'] = 'filesystem'
database = create_engine(app.config['DB_URL'], encoding = 'utf-8', pool_recycle=3600, echo=True, future=True)
basicConfig(level=INFO)

def print_log(str):
    """Print log with time"""
    info(f'{datetime.now()} {str}')

@app.route("/")
def show_main_view():
    """ rendering main page"""
    user_id = request.cookies.get('user_id')
    member_id = request.cookies.get('member_id')
    if not user_id :
        user_id = request.args.get('userId')
    print_log(f"user_id {user_id}")

    date = datetime.now()
    holidays = get_holiday_lists(date.year)
    log = Logging(database, member_id, request.remote_addr)
    log.insert_table('Access User')
    return render_template('html/main.html', data=holidays, userId=user_id)

@app.route("/WorkingHourInput.html")
def show_working_hour_input():
    """ rendering working hour input page"""
    return render_template('html/WorkingHourInput.html')

@app.route("/Login.html")
def show_log_in_page():
    """ rendering Sign in page"""
    return render_template('html/Login.html')

@app.route("/Signin.html")
def show_sign_in_page():
    """ rendering Sign in page"""
    return render_template('html/Signin.html')

@app.route("/LoginRequest", methods=['POST'])
def confirm_log_in():
    """로그인 확인"""
    userid = request.form.get('userid')
    password = request.form.get('password')

    if not(userid and password):
            return "입력되지 않은 정보가 있습니다"
    else:
        user = User(database, userid, password)
        error = ""
        if user.check_user_exist() :
            member_id = user.get_member_id()
            if member_id:
                log = Logging(database, member_id, request.remote_addr)
                log.insert_table('Login User')
                flash('로그인이 성공하였습니다.')

                resp = make_response(redirect(url_for('show_main_view', userId=userid)))
                resp.set_cookie('member_id', str(member_id))
                resp.set_cookie('user_id', userid)
                return resp
            else:
                error= "비밀번호가 틀렸습니다."
        else :
            error= "존재하지 않는 아이디입니다."
        return render_template('html/Login.html', error=error)

@app.route("/SigninRequest", methods=['POST'])
def confirm_sign_in():
    """회원가입 확인"""
    userid = request.form.get('userid')
    password = request.form.get('password')

    error = ""
    if not(userid and password):
            error= "입력되지 않은 정보가 있습니다"
    else:
        user = User(database, userid, password)
        if user.check_user_exist() :
            error= "이미 존재하는 유저입니다."
        else :
            user.insert_table()
            flash('회원가입이 완료되었습니다. 가입한 아이디로 로그인 해 주세요.')
            return redirect(url_for('show_main_view'))

    return render_template('html/Signin.html', error=error)

@app.route("/LogoutRequest", methods=['GET', 'POST'])
def logout():
    """로그아웃"""
    user_id = request.cookies.get('user_id')
    member_id = request.cookies.get('member_id')
    if user_id and member_id :
        log = Logging(database, member_id, request.remote_addr)
        log.insert_table('Logout User')
    
    resp = make_response(redirect(url_for('show_main_view', userId=None)))
    resp.delete_cookie('member_id')
    resp.delete_cookie('user_id')

    return resp

@app.route("/api/request/holidays", methods=['GET'])
def get_holidays():
    """Get holiday lists"""
    year = int(request.args.get('year'))
    return get_holiday_lists(year)


def get_holiday_lists(year):
    """ Get holidays"""
    holiday_list = ['{0:04d}-{1:02d}-{2:02d}'.format(key.year, key.month, key.day) for key in KR(years=year).keys()]
    if year == 2023:
        holiday_list.append("2023-01-24")
    elif year == 2022:
        holiday_list.append("2022-03-09")
        holiday_list.append("2022-06-01")
        holiday_list.append("2022-08-01")
        holiday_list.append("2022-08-02")
        holiday_list.append("2022-08-03")

    holiday_list = sorted(holiday_list)
    return jsonify({'holidays':holiday_list})

@app.route("/api/request/update_vacation", methods=['POST'])
def update_vacation():
    """Update vacation"""
    member_id = int(request.cookies.get('member_id'))
    year = int(request.args.get('year'))
    month = int(request.args.get('month'))
    day = int(request.args.get('day'))
    type = int(request.args.get('type'))
    user_db = UserWorking(database, member_id, year, month)

    user_db.set_working_day(day, type)
    return "success"

@app.route("/api/request/get_working_info", methods=['POST'])
def get_working_info():
    """get working information"""
    member_id = int(request.cookies.get('member_id'))
    year = int(request.args.get('year'))
    month = int(request.args.get('month'))
    user_db = UserWorking(database, member_id, year, month)

    result = user_db.get_working_info()
    if result:
        return result
    else :
        return {'working_days':[],'working_hours':[]}

@app.route("/api/request/set_working_hours", methods=['POST'])
def set_working_hours():
    """set working information"""
    member_id = int(request.cookies.get('member_id'))
    working_hours = loads(request.args.get('map'))
    for key in working_hours:
        year, month = key.split('-')
        user_db = UserWorking(database, member_id, year, month)
        if not user_db.set_working_hour(working_hours[key]):
            info(f"fail {working_hours[key]}")
        

    return 'success'

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=20000)
