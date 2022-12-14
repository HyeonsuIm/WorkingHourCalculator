from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String

Base = declarative_base()

class User(Base):
    """Class for managing User information"""
    __tablename__ = 'USER'
    MEMBER_ID = Column(Integer, primary_key=True, autoincrement=True)
    USER_ID = Column(String(256) , nullable=False)
    USER_PASSWD = Column(String(256), nullable=False)

    def __init__(self, user_id, user_passwd):
        self.USER_ID = user_id
        self.USER_PASSWD = user_passwd