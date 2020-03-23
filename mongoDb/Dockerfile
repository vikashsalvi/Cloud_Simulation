#Python base image
FROM python:3
WORKDIR /usr/src/app

COPY . .

RUN pip install pymongo
CMD ["python","extractDataFromCatalog.py"]