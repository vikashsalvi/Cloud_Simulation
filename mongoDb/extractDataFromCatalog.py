import re
import pymongo
from pymongo import TEXT
import pprint
from datetime import datetime
import time


file_name = 1996
list_of_books = []
client = pymongo.MongoClient('mongodb://localhost:27017/')
books_dict = {}
while file_name<=2020:

    file = open("files/"+str(file_name)+".txt",'r',encoding="utf-8")
    lines = file.readlines()
    lineSplit = 0
    f=0
    for line in lines:
        if len(line)==1: 
            lineSplit = 1
        else: 
            lineSplit = 0
        if f == 1:
            if lineSplit == 1:
                list_of_books.append(str(line))
            if lineSplit == 0:
                combine_two_line = list_of_books[len(list_of_books)-1]+ ' ' + str(line)
                list_of_books[len(list_of_books)-1] = combine_two_line
        if "TITLE and AUTHOR" in line:
            f = 1
    books_dict[str(file_name)+'.txt'] = list_of_books
    list_of_books = []
    file_name = file_name + 1
    

for keys in books_dict.keys():
    count = 0
    for book in books_dict[keys]:
        if "[Languages:" in book or "[Language:" in book:
            del books_dict[keys][count]
        count = count + 1


for keys in books_dict.keys():
    count = 0
    for book in books_dict[keys]:
        books_dict[keys][count] = re.sub(r'\[.*\]','',book)
        books_dict[keys][count] = re.sub(r'\n','',book)
        books_dict[keys][count] = re.sub(r'\s\s\s*\d+','',book)
        count = count + 1

db = client.CSCI5409
books = db.book_details
file_details = db.file_details
for keys in books_dict.keys():
    start_time =  datetime.now().strftime("%H:%M:%S")
    for book in books_dict[keys]:
        inner_document = {}
        split = line.strip().split('by')
        inner_document['book_title'] = re.sub('[^A-Za-z0-9\s]+','',split[0]).strip()
        if(len(split) == 1):

            inner_document['author_name'] = "Unknown"
        else:
            inner_document['author_name'] = re.sub('[^A-Za-z0-9\s]+','',split[1]).strip()
        #data.append(inner_document)  
        books_id = books.insert_one(inner_document)

    end_time =  datetime.now().strftime("%H:%M:%S")
    details = {'file_name':keys,'start_time':start_time,'end_time':end_time}
    file_details.insert_one(details)
    time.sleep(300)
    

#print("Data inserted")
#print("Creating index")
#client.CSCI5409.book_details.create_index([('book_title', TEXT),('author_name', TEXT)], default_language='english')
#print("Index created")
#print("Testing a search")
#for document in books.find({"$text": {"$search": "charles dicken"}}).limit(20):
#    pprint.pprint(document)