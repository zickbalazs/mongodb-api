require('dotenv').config();
let express = require('express'), app = express();
let mongodb = require('mongodb'), path = require('path'), multer = require('multer');
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER}:${process.env.SECRET}@cluster0.sbtswn5.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(require('cors')())

client.connect(err => {
    console.log('connected')
    const database = client.db("CRUD_Blog");
    app.get('/:table', (req,res)=>{
        let collection = database.collection(req.params.table);
        collection.find().toArray().then(results=>{
            res.send(results);
        }).catch(err=>{
            console.log(err);
            res.send('error');
        })
    })
    app.get('/:table/:field/:value', (req,res)=>{
        let collection = database.collection(req.params.table);
        let searcher = JSON.parse(`{"${req.params.field}":"${req.params.value}"}`);
        collection.find(searcher).toArray().then(results=>{
            res.send(results);
        }).catch(err=>{
            res.send(err);
        })
    })
    app.get('/:table/:id', (req,res)=>{
        let collection = database.collection(req.params.table)
        collection.find({'_id': mongodb.ObjectId(req.params.id)}).toArray().then(results=>{
            res.send(results)
        }).catch(err=>{
            console.log(err);
            res.send('error');
        })
    })
    app.post('/:table', (req,res)=>{
        let collection = database.collection(req.params.table)
        let data = {
            title: req.body.title,
            description: req.body.description,
            date: new Date(req.body.date)
        };
        collection.insertOne(data).then(result=>{
            res.send(result);
        }).catch(result=>{
            res.send(result);
        })
    })
    app.delete('/:table/:id', (req,res)=>{
        let collection = database.collection(req.params.table)
        collection.deleteOne({'_id':mongodb.ObjectId(req.params.id)}).then(result=>{
            res.send(result);
        }).catch(err=>{
            console.log(err);
            res.send('error');
        })
    })
    app.patch('/:table/:id', (req,res)=>{
        let collection = database.collection(req.params.table)
        collection.updateOne({'_id':mongodb.ObjectId(req.params.id)},{$set:req.body}).then(result=>{
            res.send(result);
        }).catch(err=>{
            res.send(err);
        })
    })
});





app.listen(process.env.PORT, console.log(`http://localhost:${process.env.PORT}/`))