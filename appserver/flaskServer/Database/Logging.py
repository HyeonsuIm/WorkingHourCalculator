from datetime import datetime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, DateTime

Base = declarative_base()

class Logging(Base):
    """Class for managing User information"""
    __tablename__ = 'LOGS'
    LOG_TIME = Column(DateTime, nullable=False, default=datetime.utcnow, primary_key=True)
    MEMBER_ID = Column(Integer)
    ACCESS_IP = Column(String(16), nullable=False)
    LOG_STR = Column(String((256)))

    def __init__(self, member_id, access_ip, log_str):
        self.MEMBER_ID = member_id
        self.ACCESS_IP = access_ip
        self.LOG_STR = log_str