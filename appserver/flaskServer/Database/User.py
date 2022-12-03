from sqlalchemy import text
from werkzeug.security import generate_password_hash, check_password_hash

class User():
    """Class for managing User information"""

    def __init__(self, database, user_id, password):
        self.database = database
        self.user_id = user_id
        self.password = password

    def check_user_exist(self):
        """Check user is exist or not"""
        user = self.database.execute(text("""
            SELECT user_id, user_passwd
            FROM USER
            WHERE user_id = :user_id"""), {
            'user_id' : self.user_id
            }).fetchone()

        return True if user else False

    def get_member_id(self):
        """Check user is exist or not"""
        user = self.database.execute(text("""
            SELECT member_id, user_passwd
            FROM USER
            WHERE user_id = :user_id"""), {
            'user_id' : self.user_id
            }).fetchone()
        if user:
            return user[0] if check_password_hash(user[1], self.password) else None
        return None

    def insert_table(self):
        """Insert user"""
        return self.database.execute(text("""
                INSERT INTO USER (
                    user_id,
                    user_passwd
                ) VALUES (
                    :user_id,
                    :password
                )"""), {
            'user_id':self.user_id,
            'password':generate_password_hash(self.password) }).lastrowid # 새로 사용자가 생성되면 새로 생성된 사용자의 아이디를 읽어들인다.