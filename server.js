const express = require("express");
const mongodb = require("mongodb");
const bodyparser = require('body-parser');
const app = express();
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
// app.use(express.static('views'));
app.use(bodyparser.urlencoded({ extended: false }));
app.listen(8080);

app.use(express.static('css'));

const MongoClient = mongodb.MongoClient;
const url = "mongodb://localhost:27017/";

let viewsPath=__dirname+/views/;
let db=null;

MongoClient.connect(url, {useNewUrlParser: true}, function (err, client) { //server url
    if (err) {
        console.log('Err  ', err);
    } else {
        console.log("Connected successfully to server");
        db = client.db('fit2095db');
        col=db.collection('fit2095dbweek6')
        // col.insertOne({name:'John',address:'Mel'});
    }
});
app.get('/',function(req,res){
    res.sendFile(viewsPath+"index.html");
});
app.get('/insert',function(req,res){
    res.sendFile(viewsPath+"insert.html");   
});
app.get('/insertMany',function(req,res){
    res.sendFile(viewsPath+"insertMany.html");   
});
app.get('/getAll',function(req,res){
    col.find({}).toArray(function (err, data) {
        res.render('getAll', { usersDb: data });
    });     
});
app.get('/deleteuser',function(req,res){
    res.sendFile(viewsPath+"deleteUser.html");   
});
app.get('/deleteOne',function(req,res){
    res.sendFile(viewsPath+"deleteOne.html");   
});
app.get('/deleteAll',function(req,res){
    res.sendFile(viewsPath+"deleteAll.html");   
});
app.get('/update',function(req,res){
    res.sendFile(viewsPath+"update.html");   
});
app.post('/addNewTask', function (req, res) {
    let userDetails = req.body;
    let randomId = (Math.round(Math.random() * 100));
    col.insertOne({ Taskid:randomId,Task: userDetails.taskName, assignPerson: userDetails.personName, dueDate: userDetails.dueDate, taskStatus: userDetails.taskStatus , taskDescription:userDetails.description });
    res.redirect('/insert'); // redirect the client to list users page
});

app.post('/addManyNewTask', function (req, res) {
    let userDetails = req.body;
    let count=userDetails.count;
    let query=[];
    for(let i=0;i<count;i++){
        let randomId = (Math.round(Math.random() * 100));
        query.push({ Taskid:randomId,Task: userDetails.taskName,
            assignPerson: userDetails.personName, 
            dueDate: userDetails.dueDate,
            taskStatus: userDetails.taskStatus ,
             taskDescription:userDetails.description})
    
    }
    col.insertMany(query);
    res.redirect('/insertMany'); // redirect the client to list users page
});

app.post('/updateuserdata', function (req, res) {
    let userDetails = req.body;
    let filter = { Taskid: parseInt(userDetails.taskID) };
    // let filter = { taskName: userDetails.taskName }
    let theUpdate = { $set: { taskStatus: userDetails.taskStatus }};
    db.collection('fit2095dbweek6').updateOne(filter, theUpdate);
    res.redirect('/update');// redirect the client to list users page
})
app.post('/deleteAll', function (req, res) {
    // let theUpdate = { $gte: 0};
    db.collection('fit2095dbweek6').deleteMany({Taskid: {$gte: 0}});
    res.redirect('/deleteAll');// redirect the client to list users page
})
app.post('/deleteOne', function (req, res) {
    let userDetails = req.body;
    let filter = { Taskid: userDetails.taskID };
    db.collection('fit2095dbweek6').deleteOne(filter);
    res.redirect('/deleteOne');// redirect the client to list users page
})