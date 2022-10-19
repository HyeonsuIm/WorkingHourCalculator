FROM python:3.8
RUN mkdir /usr/src/app
WORKDIR /usr/src/app

COPY . .
RUN pip3 install --no-cache-dir -r requiremenets.txt
EXPOSE 20000
CMD ["python", "/usr/src/app/main.py"]
