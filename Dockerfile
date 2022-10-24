FROM python:3.8
RUN mkdir /usr/src/app
WORKDIR /usr/src/app

COPY . .
RUN pip3 install --upgrade pip
RUN pip3 install --no-cache-dir -r requirements.txt

EXPOSE 20000
CMD ["uwsgi", "uwsgi.ini"]