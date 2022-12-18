from flaskServer.Database.UserWorking import UserWorking
from sqlalchemy.orm import sessionmaker

class UserWorkingHandler():
    """Class for managing User Working information"""

    def __init__(self, member_id, year, month):
        self.member_id = member_id
        self.year = year
        self.month = month
    
    def set_working_day(self, session_maker, day, val):
        """set working day information"""
        success = True
        
        with session_maker.begin() as session:
            try:
                is_add=False
                is_success, working_info = self.__get_working_info(session, True)
                if is_success is False:
                    is_add=True
                
                working_info['working_days'][day] = val
                self.__update_working_info(session, working_info, is_add)
            except Exception as err:
                print(f"error : {err=}, {type(err)=}")
                success=False
        return success
    
    def set_working_hour(self, session_maker, day_minutes):
        """set working day information"""
        success = True
        with session_maker.begin() as session:
            try:
                is_success, working_info = self.__get_working_info(session, True)
                is_add=False
                if is_success is False:
                    is_add=True
                
                for day, minute in day_minutes:
                    working_info['working_hours'][day] = minute
            
                self.__update_working_info(session, working_info, is_add)
            except Exception as err:
                print(f"error : {err=}, {type(err)=}")
                success=False
        return success

    def get_working_info(self, session_maker):
        """Check user is exist or not"""
        result = None
        with session_maker.begin() as session:
            result = self.__get_working_info(session, False)
        return result[1]

    def __get_working_info(self, session, for_update):
        """Check user is exist or not"""
        query = session.query(UserWorking.MONTH_WORK_TYPES_MINUTES).filter_by(MEMBER_ID=self.member_id, YEAR=self.year, MONTH=self.month)
        if for_update :
            result = query.with_for_update().first()
        else:
            result = query.first()
        if result :
            return [True, result[0]]
        else:
            return [False, self.__get_default_working_info()]

    def __get_default_working_info(self):
        """set default column"""
        return {
            'working_days' : [0 for i in range(32)],
            'working_hours' : [0 for i in range(32)]
        }

    def __update_working_info(self, session, working_info, is_add):
        """set default column"""
        if is_add:
            user_working = UserWorking(self.member_id, self.year, self.month, working_info)
            session.add(user_working)
        else:
            session.query(UserWorking).filter_by(MEMBER_ID=self.member_id, YEAR=self.year, MONTH=self.month).update({'MONTH_WORK_TYPES_MINUTES':working_info})
