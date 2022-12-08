from sqlalchemy import text
from json import dumps, loads

class UserWorking():
    """Class for managing User Working information"""

    def __init__(self, database, member_id, year, month):
        self.database = database
        self.member_id = member_id
        self.year = year
        self.month = month

    def make_working_info_column(self):
        """set default column"""
        working_info = {
            'working_days' : [0 for i in range(32)],
            'working_hours' : [0 for i in range(32)]
        }
        return self.database.execute(text("""
            INSERT INTO USER_WORKING (
                MEMBER_ID,
                YEAR,
                MONTH,
                MONTH_WORK_TYPES_MINUTES
            ) VALUES (
                :member_id,
                :year,
                :month,
                :working_info
            )"""), {
        'member_id':self.member_id,
        'year':self.year,
        'month':self.month,
        'working_info':dumps(working_info)}).lastrowid

    def update_working_info(self, working_info):
        """set default column"""
        return self.database.execute(text("""
            UPDATE USER_WORKING
            SET MONTH_WORK_TYPES_MINUTES=:working_info
            WHERE MEMBER_ID=:member_id AND YEAR=:year AND MONTH=:month"""), {
            'working_info':dumps(working_info),
            'member_id':self.member_id,
            'year':self.year,
            'month':self.month}).lastrowid # 새로 사용자가 생성되면 새로 생성된 사용자의 아이디를 읽어들인다.
    
    def set_working_day(self, day, val):
        """set working day information"""
        working_info = self.get_working_info()
        if not working_info:
            self.make_working_info_column()
            working_info = self.get_working_info()
        
        working_info['working_days'][day] = val
        return self.update_working_info(working_info)
    
    def set_working_hour(self, day, minute):
        """set working day information"""
        working_info = self.get_working_info()
        if not working_info:
            self.make_working_info_column()
            working_info = self.get_working_info()
        
        working_info['working_hours'][day] = minute
        
        return self.update_working_info(working_info)

    def get_working_info(self):
        """Check user is exist or not"""
        result = self.database.execute(text("""
            SELECT MONTH_WORK_TYPES_MINUTES
            FROM USER_WORKING
            WHERE MEMBER_ID = :member_id AND YEAR = :year AND MONTH = :month"""), {
            'member_id' : self.member_id,
            'year' : self.year,
            'month' : self.month
            }).fetchone()
        if result :
            return loads(result[0])
        return None