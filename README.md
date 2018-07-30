#Platform
The platform directory contains 4 modules. The "server.js" is in the root and uses the other 3 which arelocated in "public" directory and include "index.html", "client.js", and "styles.css". In the following Paragraphs I will go through the functions of The first two modules one by one one by one.
Before dooing that please pay attention to the requirements.

##0- Requirements
Please install the following modules:

- -Express
- -Socket.io
- -PG 

##1- server.js

###1.1- createDB():
- When the server starts to work for the first time this function will be called to create a table in order to save or load files in future. Please, note that for future use you need to comment calling of this function in order to avoid any errors during runtime. The primary table has two columns which have postGreSQL formats of text and bytea.

###1.2- openPool():
- This function creates a pool of connections and returns the "pool" object. The primary database is named as "narimant". This function is meant to be called once to create a pool of connections. This reducees the overhead of opening and closing multiple connections. Each time you need access to the database you can easily call "pool" object and make a query. 

###1.3- populateDB(query): 
- This function is meant to insert entries into the table. The "query" object is actually sql commands and has certain fields which are defined inside the definition of object. During the code this function is called with an argument of "insertingQuery" which is defined below:

  ####1.3.1- insertingQuery: 
  - This object has three fields and is called with the "populateDB" function. the "name" filed is just like an explanation and is not important. The "text" and "values" filed are related to sql syntax and are meant to communicate with the table. 

###1.4- pullData(query, socket):
- This function has two purposes, first is to take the intended value from the table upon client request, and second, to send it to the client who has requested for that. The function is called with two arguments which will be explained as follows:

 ####1.4.1- pullingQuery: 
 - This object has three fields again and sits in place of "query" in "pullData" function. The name is not important. The text will target the "img" entry of the database. And the value determines the targeted row. 

 ####1.4.2- socket: 
 - Each connection to the server is made via a socket. There can be multiple active sockets at the same time. Each socket has two ends one in client and one in server and can be accessed from both ends. So, we will call that both in server and client side to make a communication.

###1.5- on(...): 
 - This function is used to do some task when an event driven change happens in either client or server situation.

##2- client.js
###2.1- file.addEventListener('change')
 - This function listens to the user. Once a user chooses a file a change is triggered and the function hears. If the user does not cancel the submission (i.e, length of the file is not zero) Please note that the file is submitted as a BLOB. Then, a 'reader' will read this file as an arrayBuffer and on the load end, emits this on the corresponding socket after the reading process finishes.

###2.2- btn.addEventListener('click')
- Another action of the user is to type the name of an image and request for that by clicking the button. Once the user cicks the 'send' button on the browser it will be heared by this function and then will be emitted to the server. Receiving this request, the server will run the 'pullData' function and pulls the corresponding image and sends this to the user as an arrayBuffer. Please note that the files are put on the database as byte arrays, BUT, when being emitted it will automatically convert to and sent as arrayBuffer. 

Please note that the encode function and the last 5 lines of the code are just for better visualizatoin and can be deleted. So, I will not explain them here.   