from sqlalchemy import text

class Logging():
    """Class for managing User information"""

    def __init__(self, database, member_id, access_ip):
        self.database = database
        self.member_id = member_id
        self.access_ip = access_ip

    def insert_table(self, log_str):
        """Insert log"""
        return self.database.execute(text("""
                INSERT INTO LOGS (
                    MEMBER_ID,
                    ACCESS_IP,
                    LOG_STR
                ) VALUES (
                    :member_id,
                    :access_ip,
                    :log_str
                )"""), {
            'member_id':self.member_id,
            'access_ip':self.access_ip,
            'log_str':log_str}).lastrowid # 새로 사용자가 생성되면 새로 생성된 사용자의 아이디를 읽어들인다.