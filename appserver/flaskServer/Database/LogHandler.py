from flaskServer.Database.Logging import Logging

class LogHandler():
    """Class for managing log information"""
    def __init__(self, session_maker, member_id, access_ip, log_str):
        self.session_maker = session_maker
        self.member_id = member_id
        self.access_ip = access_ip
        self.log_str = log_str
    
    def insertLog(self):
        with self.session_maker.begin() as session:
            log = Logging(self.member_id, self.access_ip, self.log_str)
            session.add(log)