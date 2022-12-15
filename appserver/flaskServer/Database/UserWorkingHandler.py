from flaskServer.Database.UserWorking import UserWorking
from sqlalchemy.orm import sessionmaker

class UserWorkingHandler():
    """Class for managing User Working information"""

    def __init__(self, member_id, year, month):
        self.member_id = member_id
        self.year = year
        self.month = month
    
    def set_working_day(self, engine, day, val):
        """set working day information"""
        success = True
        Session = sessionmaker(bind=engine, autocommit=False, autoflush=False)
        session = Session()
        with session.begin():
            session.connection(execution_options={'isolation_level':'SERIALIZABLE'})
            is_add=False
            is_success, working_info = self.__get_working_info(session)
            if is_success is False:
                is_add=True
            
            working_info['working_days'][day] = val
            try:
                self.__update_working_info(session, working_info, is_add)
            except:
                success=False
                session.rollback()
        session.close()
        return success
    
    def set_working_hour(self, engine, day_minutes):
        """set working day information"""
        success = True
        Session = sessionmaker(bind=engine, autocommit=False, autoflush=False)
        session = Session()
        with session.begin():
            session.connection(execution_options={'isolation_level':'SERIALIZABLE'})
            is_success, working_info = self.__get_working_info(session)
            is_add=False
            if is_success is False:
                is_add=True
            
            for day, minute in day_minutes:
                working_info['working_hours'][day] = minute
            try:
                self.__update_working_info(session, working_info, is_add)
            except:
                session.rollback()
                success=False
        session.close()
        return success

    def get_working_info(self, engine):
        """Check user is exist or not"""
        Session = sessionmaker(bind=engine, autocommit=False, autoflush=False)
        session = Session()
        result = None
        with session.begin():
            session.connection(execution_options={'isolation_level':'SERIALIZABLE'})
            result = self.__get_working_info(session)
        session.close()
        return result[1]

    def __get_working_info(self, session):
        """Check user is exist or not"""
        result = session.query(UserWorking.MONTH_WORK_TYPES_MINUTES).filter_by(MEMBER_ID=self.member_id, YEAR=self.year, MONTH=self.month).first()
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
