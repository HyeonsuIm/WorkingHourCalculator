from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import ForeignKey, PrimaryKeyConstraint, Column, Integer, JSON

from flaskServer.Database.User import User

Base = declarative_base()

class UserWorking(Base):
    """Class for managing User Working information"""
    __tablename__ = 'USER_WORKING'
    MEMBER_ID = Column(Integer, ForeignKey(User.MEMBER_ID), nullable=False)
    YEAR = Column(Integer, nullable=False)
    MONTH = Column(Integer, nullable=False)
    MONTH_WORK_TYPES_MINUTES = Column(JSON)

    __table_args__ = (
        PrimaryKeyConstraint('MEMBER_ID', 'YEAR', 'MONTH', name='unique_key'),
        {},
    )

    def __init__(self, member_id, year, month, month_work_types_miniute):
        self.MEMBER_ID = member_id
        self.YEAR = year
        self.MONTH = month
        self.MONTH_WORK_TYPES_MINUTES = month_work_types_miniute
