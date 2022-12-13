from User import User
from werkzeug.security import generate_password_hash, check_password_hash

class UserHandler():
    """Class for user data handling"""

    def __init__(self, db_session, user_id, password):
        self.db_session = db_session
        self.user_id = user_id
        self.user_passwd = password

    def check_user_exist(self):
        """Check user is exist or not"""
        return True if self.db_session.query(User).filter_by(USER_ID=self.user_id).count() else False

    def get_member_id(self):
        """Check user is exist or not"""
        user = self.db_session.query(User).filter_by(USER_ID=self.user_id)
        if user:
            return user[0] if check_password_hash(user[1], self.user_passwd) else None
        return None

    def insert_table(self):
        """Insert user"""
        user = User(self.user_id, generate_password_hash(self.user_passwd))
        self.db_session.add(user)
        self.db_session.commit()
        return True # 새로 사용자가 생성되면 새로 생성된 사용자의 아이디를 읽어들인다.