"""Web server main"""
from logging import basicConfig, info, INFO

from datetime import datetime
from flask import Flask, render_template, request, flash, url_for, redirect, make_response
from sqlalchemy import create_engine
from holidays import KR
from flaskServer.Database.User import User

app = Flask(__name__, static_url_path='/static')
app.config.from_pyfile("config.py")
app.secret_key = 'super secret key'
app.config['SESSION_TYPE'] = 'filesystem'
database = create_engine(app.config['DB_URL'], encoding = 'utf-8', max_overflow = 0)
basicConfig(level=INFO)

@app.route("/")
def show_main_view():
    """ rendering main page"""
    user_id = request.cookies.get('user_id')
    if not user_id :
        user_id = request.args.get('userId')
    info("user_id %s", user_id)

    date = datetime.now()
    holidays = get_holiday_lists(date.year)
    info("* access user %s", request.remote_addr)
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
        info("* access user %s %s", user.user_id, user.password)
        error = ""
        if user.check_user_exist() :
            member_id = user.get_member_id()
            if member_id:
                info("* login success %s %s %s", member_id, userid, request.remote_addr)
                flash('로그인이 성공하였습니다.')

                resp = make_response(redirect(url_for('show_main_view', userId=userid)))
                resp.set_cookie('member_id', str(member_id))
                resp.set_cookie('user_id', userid)
                return resp
            else:
                error= "비밀번호가 틀렸습니다."
        else :
            error= "존재하지 않는 아이디입니다."
        info("* login fail %s %s", userid, request.remote_addr)
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
            info("* signin user %s %s", user.user_id, user.password)
            flash('회원가입이 완료되었습니다. 가입한 아이디로 로그인 해 주세요.')
            return redirect(url_for('show_main_view', userId=userid))

    return render_template('html/Signin.html', error=error)

@app.route("/LogoutRequest", methods=['GET', 'POST'])
def logout():
    """로그아웃"""
    user_id = request.cookies.get('user_id')
    member_id = request.cookies.get('member_id')
    if not user_id and not member_id :
        info("* logout %s %s", member_id, user_id, request.remote_addr)
    
    resp = make_response(redirect(url_for('show_main_view', userId=None)))
    resp.delete_cookie('member_id')
    resp.delete_cookie('user_id')

    return resp


def get_holiday_lists(year):
    """ Get holidays"""
    return list(KR(years=year).keys())

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=20000)
