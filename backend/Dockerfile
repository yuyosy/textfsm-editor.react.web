FROM python:3.12-slim-bullseye AS development

WORKDIR /usr/app

COPY ./requirements.txt /usr/app/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /usr/app/requirements.txt
COPY . /usr/app

CMD ["uvicorn", "src.main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"]
