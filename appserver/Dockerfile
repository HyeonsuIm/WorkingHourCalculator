# Stage 1: JS 빌드
FROM node:20-slim AS js-builder
WORKDIR /build
COPY package.json ./
RUN npm install
COPY src/ ./src/
COPY vite.config.ts tsconfig.json ./
RUN npm run build

# Stage 2: Python 앱
FROM python:3.12
WORKDIR /usr/src/app

ENV POETRY_VERSION=1.8.3 \
    POETRY_VIRTUALENVS_CREATE=false \
    POETRY_NO_INTERACTION=1

RUN pip install "poetry==$POETRY_VERSION"

COPY pyproject.toml poetry.lock* ./
RUN poetry install --only main --no-root

COPY . .
COPY --from=js-builder /build/static/dist ./static/dist

EXPOSE 19999
CMD ["uwsgi", "uwsgi.ini"]
