require('dotenv').config();
let express = require('express'), app = express();
const { default: axios } = require('axios');
let mongodb = require('mongodb'), path = require('path'), multer = require('multer'), pug = require('pug');
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER}:${process.env.SECRET}@cluster0.sbtswn5.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(require('cors')())
app.use('/bootstrap', express.static(path.join(__dirname, './node_modules/bootstrap/dist')));
app.use('/jquery', express.static(path.join(__dirname, './node_modules/jquery/dist')));
app.use('/bootstrap-icons', express.static(path.join(__dirname, './node_modules/bootstrap-icons/font')));
app.use('/css', express.static(path.join(__dirname, './frontend/assets/css')));
app.use('/js', express.static(path.join(__dirname, './frontend/assets/js')));

client.connect(err => {
    console.log('connected')
    const database = client.db("CRUD_Blog");
    app.get('/', (req,res)=>{
        axios.get('http://localhost:8080/api/blogs').then(response=>{
            res.status(200).send(pug.compileFile('./frontend/blog.pug')({
                appName:'PugBlog',
                author: 'ZB',
                links: require('./data'),
                posts: response.data
            }));
        }).catch(response=>{
            res.status(200).send(pug.compileFile('./frontend/blog.pug')({
                appName:'PugBlog',
                author: 'ZB',
                links: require('./data'),
                posts: []
            }));
        })
    })
    app.get('/admin', (req,res)=>{
        axios.get('http://localhost:8080/api/blogs').then(response=>{
            res.status(200).send(pug.compileFile('./frontend/admin.pug')({
                appName:'PugBlog',
                author:'ZB',
                links:require('./data'),
                posts:response.data
            }));
            
        })
    })
    app.get('/post/:id', (req,res)=>{
        axios.get('http://localhost:8080/api/blogs/'+req.params.id).then(response=>{
            res.status(200).send(pug.compileFile('./frontend/post.pug')({
                appName:'PugBlog',
                author:'ZB',
                links:require('./data'),
                post: response.data[0]
            }));
        }).catch(response=>{
            res.status(200).send(pug.compileFile('./frontend/post.pug', {
                appName:'PugBlog',
                author:'ZB',
                links:require('./data'),
                post: {}
            }))
        })
    })
    
    app.get('/api/:table', (req,res)=>{
        let collection = database.collection(req.params.table);
        collection.find().toArray().then(results=>{
            res.send(results);
        }).catch(err=>{
            console.log(err);
            res.send('error');
        })
    })
    app.get('/api/:table/:field/:value', (req,res)=>{
        let collection = database.collection(req.params.table);
        let searcher = JSON.parse(`{"${req.params.field}":"${req.params.value}"}`);
        collection.find(searcher).toArray().then(results=>{
            res.send(results);
        }).catch(err=>{
            res.send(err);
        })
    })
    app.get('/api/:table/:id', (req,res)=>{
        let collection = database.collection(req.params.table)
        collection.find({'_id': mongodb.ObjectId(req.params.id)}).toArray().then(results=>{
            res.send(results)
        }).catch(err=>{
            console.log(err);
            res.send('error');
        })
    })
    app.post('/api/:table', (req,res)=>{
        let collection = database.collection(req.params.table)
        if (req.body.date != undefined) req.body.date = new Date(req.body.date);
        collection.insertOne(req.body).then(result=>{
            res.send(result);
        }).catch(result=>{
            res.send(result);
        })
    })
    app.delete('/api/:table/:id', (req,res)=>{
        let collection = database.collection(req.params.table)
        collection.deleteOne({'_id':mongodb.ObjectId(req.params.id)}).then(result=>{
            res.send(result);
        }).catch(err=>{
            console.log(err);
            res.send('error');
        })
    })
    app.patch('/api/:table/:id', (req,res)=>{
        let collection = database.collection(req.params.table)
        collection.updateOne({'_id':mongodb.ObjectId(req.params.id)},{$set:req.body}).then(result=>{
            res.send(result);
        }).catch(err=>{
            res.send(err);
        })
    })
});





app.listen(process.env.PORT, console.log(`http://localhost:${process.env.PORT}/`))