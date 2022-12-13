from UserWorking import UserWorking
from json import dumps,loads

class UserWorkingHandler():
    """Class for managing User Working information"""

    def __init__(self, db_session, member_id, year, month):
        self.db_session = db_session
        self.member_id = member_id
        self.year = year
        self.month = month

    def get_default_working_info(self):
        """set default column"""
        return {
            'working_days' : [0 for i in range(32)],
            'working_hours' : [0 for i in range(32)]
        }

        execute_obj = self.database
        if self.conn:
            execute_obj = self.conn

        return execute_obj.execute(text("""
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
        return execute_obj.execute(text("""
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
            working_info = self.get_default_working_info()
        
        working_info['working_days'][day] = val
        result = self.update_working_info(working_info)
        self.db_session.commit()
        return result
    
    def set_working_hour(self, day_minutes):
        """set working day information"""
        working_info = self.get_working_info()
        if not working_info:
            working_info = self.get_default_working_info()
        
        for day, minute in day_minutes:
            working_info['working_hours'][day] = minute
        
        result = self.update_working_info(working_info)
        self.db_session.commit()
        return result

    def get_working_info(self):
        """Check user is exist or not"""
        
        result = self.db_session.query(UserWorking).filter_by(MEMBER_ID=self.member_id, YEAR=self.year, MONTH=self.month)
        if result :
            return loads(result[0])
        else:
            return None