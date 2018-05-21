var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");
 
var app = express();
var jsonParser = bodyParser.json();
 
app.use(express.static(__dirname + "/public"));
// получение списка книг
app.get("/api/books", function(req, res){
      
    var content = fs.readFileSync("books.json", "utf8");
    var books = JSON.parse(content);
   
    res.send(books);
});
// получение одной книги по id
app.get("/api/books/:id", function(req, res){
      
    var id = req.params.id; // получаем id из request запроса
    var content = fs.readFileSync("books.json", "utf8");
    var books = JSON.parse(content);
    var book = null;
    // находим в массиве книгу по id
    for(var i=0; i<books.length; i++){
        if(books[i].id==id){
            book = books[i];
            break;
        }
    }
    // отправляем книгу если она нашлась
    if(book){
        res.send(book);
    }
    else{
        res.status(404).send();
    }
});
// получение отправленных данных
app.post("/api/books", jsonParser, function (req, res) {
     
    if(!req.body) return res.sendStatus(400);
     
    var bookTitle = req.body.title;
    var bookDescription = req.body.description;
    var bookAuthors = req.body.authors;
    var bookYear = req.body.year;
    var book = {title: bookTitle, description: bookDescription, authors: bookAuthors, year: bookYear};
    var data = fs.readFileSync("books.json", "utf8");
    var books = JSON.parse(data);
     
    // находим максимальный id
    var id = Math.max.apply(Math,books.map(function(o){return o.id;}))
    // увеличиваем его на единицу
    book.id = id+1;
    // добавляем книгу в массив
    books.push(book);
    var data = JSON.stringify(books);
    // перезаписываем файл с новыми данными
    fs.writeFileSync("books.json", data);
    res.send(book);
});
 // удаление книги по id
app.delete("/api/books/:id", function(req, res){
      
    var id = req.params.id;
    var data = fs.readFileSync("books.json", "utf8");
    var books = JSON.parse(data);
    var index = -1;
    // находим индекс книги в массиве
    for(var i=0; i<books.length; i++){
        if(books[i].id==id){
            index=i;
            break;
        }
    }
    if(index > -1){
        // удаляем книгу из массива по индексу
        var book = book.splice(index, 1)[0];
        var data = JSON.stringify(books);
        fs.writeFileSync("books.json", data);
        // отправляем удалённую книгу
        res.send(book);
    }
    else{
        res.status(404).send();
    }
});
// изменение книги
app.put("/api/books", jsonParser, function(req, res){
      
    if(!req.body) return res.sendStatus(400);
     
    var bookId = req.body.id;
    var bookTitle = req.body.title;
    var bookDescription = req.body.description;
    var bookAuthors = req.body.authors;
    var bookYear = req.body.year;
    var data = fs.readFileSync("books.json", "utf8");
    var books = JSON.parse(data);
    var book;
    for(var i=0; i<books.length; i++){
        if(books[i].id==bookId){
            book = books[i];
            break;
        }
    }
    // изменяем данные у книги
    if(book){
        book.title = bookTitle;
        book.description = bookDescription;
        book.authors = bookAuthors;
        book.year = bookYear;
        
        var data = JSON.stringify(books);
        fs.writeFileSync("books.json", data);
        res.send(book);
    }
    else{
        res.status(404).send(book);
    }
});
  
app.listen(3000, function(){
    console.log("Сервер ожидает подключения...");
});