from flaskServer.Database.User import User
from werkzeug.security import generate_password_hash, check_password_hash

class UserHandler():
    """Class for user data handling"""

    def __init__(self, session_maker, user_id, password):
        self.session_maker = session_maker
        self.user_id = user_id
        self.user_passwd = password

    def check_user_exist(self):
        """Check user is exist or not"""
        result = False
        with self.session_maker.begin() as session:
            if session.query(User).filter_by(USER_ID=self.user_id).count():
                result = True
        return result

    def get_member_id(self):
        """Check user is exist or not"""
        result = None
        with self.session_maker.begin() as session:
            user = session.query(User.MEMBER_ID, User.USER_PASSWD).filter_by(USER_ID=self.user_id).first()
            if user:
                result = user[0] if check_password_hash(user[1], self.user_passwd) else None
        return result

    def insert_table(self):
        """Insert user"""
        
        with self.session_maker.begin() as session:
            user = User(self.user_id, generate_password_hash(self.user_passwd))
            session.add(user)
        return True # 새로 사용자가 생성되면 새로 생성된 사용자의 아이디를 읽어들인다.