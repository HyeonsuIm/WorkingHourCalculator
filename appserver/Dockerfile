FROM python:3.8
RUN mkdir /usr/src/app
WORKDIR /usr/src/app

COPY . .
RUN python3 -m pip install --upgrade pip
RUN pip3 install --no-cache-dir -r requirements.txt

EXPOSE 19999
CMD ["uwsgi", "uwsgi.ini"]