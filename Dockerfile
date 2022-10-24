FROM python:3.8
RUN mkdir /usr/src/app
WORKDIR /usr/src/app

COPY . .
RUN pip3 install --no-cache-dir -r requiremenets.txt
RUN apt-get update
RUN apt-get -y install uwsgi uwsgi-plugin-python3
EXPOSE 20000
CMD ["uwsgi", "uwsgi.ini"]