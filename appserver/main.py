"""Web server main"""
from logging import basicConfig, info, INFO
from json import loads
import json
import os
import requests as ext_requests

from datetime import datetime, timezone, timedelta
from flask import Flask, render_template, request, flash, url_for, redirect, make_response, jsonify
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base

from holidays import KR

HOLIDAY_CACHE_FILE = os.path.join(os.path.dirname(__file__), '.holiday_cache.json')

from flaskServer.Database.LogHandler import LogHandler
from flaskServer.Database.UserHandler import UserHandler
from flaskServer.Database.UserWorkingHandler import UserWorkingHandler

app = Flask(__name__, static_url_path='/static')
app.config.from_pyfile("config.py")
app.secret_key = 'super secret key'
app.config['SESSION_TYPE'] = 'filesystem'
engine = create_engine(
    app.config['DB_URL'],
    encoding = 'utf-8',
    pool_recycle=3600,
    echo=False,
    future=True,
    isolation_level='REPEATABLE READ')
Base = declarative_base()
#Base.metadata.create_all(database)
session_maker = sessionmaker(bind=engine, autocommit=False, autoflush=False)
KST = timezone(timedelta(hours=9))

basicConfig(level=INFO)

def print_log(str):
    """Print log with time"""
    info(f'{datetime.now(KST)} {str}')

@app.route("/")
def show_main_view():
    """ rendering main page"""
    user_id = request.cookies.get('user_id')
    member_id = request.cookies.get('member_id')
    if not user_id :
        user_id = request.args.get('userId')

    date = datetime.now()
    holidays = get_holiday_lists(date.year)
    log = LogHandler(session_maker, member_id, request.remote_addr, 'Access User')
    print_log(f"Access User : {request.remote_addr}, {user_id}")
    #log.insertLog()
    
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
        user_handler = UserHandler(session_maker, userid, password)
        error = ""
        if user_handler.check_user_exist() :
            member_id = user_handler.get_member_id()
            if member_id:
                log = LogHandler(session_maker, member_id, request.remote_addr, 'Login User')
                print_log(f"Login User : {member_id}")
                log.insertLog()
                flash('로그인이 성공하였습니다.')

                resp = make_response(redirect(url_for('show_main_view')))
                resp.set_cookie('member_id', str(member_id), max_age=3600*24*30)
                resp.set_cookie('user_id', userid, max_age=3600*24*30)

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
        user_handler = UserHandler(session_maker, userid, password)
        if user_handler.check_user_exist() :
            error= "이미 존재하는 유저입니다."
        else :
            user_handler.insert_table()
            flash('회원가입이 완료되었습니다. 가입한 아이디로 로그인 해 주세요.')
            return redirect(url_for('show_main_view'))

    return render_template('html/Signin.html', error=error)

@app.route("/LogoutRequest", methods=['GET', 'POST'])
def logout():
    """로그아웃"""
    user_id = request.cookies.get('user_id')
    member_id = request.cookies.get('member_id')
    if user_id and member_id :
        try:
            log = LogHandler(session_maker, member_id, request.remote_addr, 'Logout User')
            print_log(f"Logout User : {member_id}")
            log.insertLog()
        except Exception as e:
            print_log(f"Logout log error (ignored): {e}")

    resp = make_response(redirect(url_for('show_main_view', userId=None)))
    resp.delete_cookie('member_id')
    resp.delete_cookie('user_id')

    return resp

@app.route("/api/request/public-days", methods=['GET'])
def get_holidays():
    """Get holiday lists"""
    year = int(request.args.get('year'))
    return get_holiday_lists(year)


def _load_cache():
    try:
        with open(HOLIDAY_CACHE_FILE, 'r') as f:
            return json.load(f)
    except Exception:
        return {}

def _save_cache(cache):
    try:
        with open(HOLIDAY_CACHE_FILE, 'w') as f:
            json.dump(cache, f)
    except Exception as e:
        print_log(f"Holiday cache write error: {e}")

def _is_cache_valid(cache, year):
    entry = cache.get(str(year))
    if not entry:
        return False
    cached_at = datetime.fromisoformat(entry['cached_at'])
    ttl = timedelta(days=app.config.get('HOLIDAY_CACHE_TTL_DAYS', 7))
    return datetime.now() - cached_at < ttl

def _fetch_from_api(year):
    """공공데이터포털 특일정보 API로 공휴일 조회. {날짜: 이름} dict 반환"""
    url = "http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo"
    api_key = app.config.get('HOLIDAY_API_KEY', '')
    holiday_map = {}

    for month in range(1, 13):
        params = {
            'serviceKey': api_key,
            'solYear': year,
            'solMonth': f'{month:02d}',
            'numOfRows': 20,
            '_type': 'json',
        }
        try:
            res = ext_requests.get(url, params=params, timeout=5)
            items = res.json().get('response', {}).get('body', {}).get('items', '') or {}
            item_list = items.get('item', [])
            if isinstance(item_list, dict):
                item_list = [item_list]
            for item in item_list:
                if item.get('isHoliday') == 'Y':
                    d = str(item['locdate'])
                    date_str = f"{d[:4]}-{d[4:6]}-{d[6:]}"
                    holiday_map[date_str] = item.get('dateName', '')
        except Exception as e:
            print_log(f"Holiday API error (month={month}): {e}")
            return None  # API 실패 시 None 반환 → fallback

    return holiday_map

def _fetch_fallback(year):
    """holidays 라이브러리 기반 fallback. {날짜: 이름} dict 반환"""
    return {
        '{:04d}-{:02d}-{:02d}'.format(k.year, k.month, k.day): v
        for k, v in KR(years=year).items()
    }

def get_holiday_lists(year):
    cache = _load_cache()

    if not _is_cache_valid(cache, year):
        api_key = app.config.get('HOLIDAY_API_KEY', '')
        if api_key:
            print_log(f"Fetching holidays from API for {year}")
            holiday_map = _fetch_from_api(year)
            if holiday_map is None:
                print_log(f"API failed, using fallback for {year}")
                holiday_map = _fetch_fallback(year)
        else:
            holiday_map = _fetch_fallback(year)

        cache[str(year)] = {
            'holidays': holiday_map,
            'cached_at': datetime.now().isoformat(),
        }
        _save_cache(cache)
        print_log(f"Holiday cache updated for {year} ({len(holiday_map)} days)")
    else:
        holiday_map = cache[str(year)]['holidays']

    return jsonify({'holidays': holiday_map})

@app.route("/api/request/update_vacation", methods=['POST'])
def update_vacation():
    """Update vacation"""
    member_id = int(request.cookies.get('member_id'))
    year = int(request.args.get('year'))
    month = int(request.args.get('month'))
    day = int(request.args.get('day'))
    vacation_type = int(request.args.get('type'))
    user_db = UserWorkingHandler(member_id, year, month)

    if not user_db.set_working_day(session_maker, day, vacation_type):
        user_db.set_working_day(session_maker, day, vacation_type)
    return "success"

@app.route("/api/request/get_working_info", methods=['POST'])
def get_working_info():
    """get working information"""
    member_id = int(request.cookies.get('member_id'))
    year = int(request.args.get('year'))
    month = int(request.args.get('month'))
    user_db = UserWorkingHandler(member_id, year, month)

    return user_db.get_working_info(session_maker)

@app.route("/api/request/set_working_hours", methods=['POST'])
def set_working_hours():
    """set working information"""
    member_id = int(request.cookies.get('member_id'))
    working_hours = loads(request.args.get('map'))
    print_log(f"{member_id} : {working_hours}")
    for key in working_hours:
        year, month = key.split('-')
        user_db = UserWorkingHandler(member_id, year, month)
        if not user_db.set_working_hour(session_maker, working_hours[key]):
            user_db.set_working_hour(session_maker, working_hours[key])
        
    return 'success'

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=20000)
