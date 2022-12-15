from flaskServer.Database.Logging import Logging

class LogHandler():
    """Class for managing log information"""
    def __init__(self, db_session, member_id, access_ip, log_str):
        self.db_session = db_session
        self.member_id = member_id
        self.access_ip = access_ip
        self.log_str = log_str
    
    def insertLog(self):
        log = Logging(self.member_id, self.access_ip, self.log_str)
        self.db_session.add(log)
        self.db_session.commit()