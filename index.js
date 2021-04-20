const express = require('express')
const bodyParser = require('body-parser');
const cors=require('cors');

const MongoClient = require('mongodb').MongoClient;
const objectID=require('mongodb').ObjectID

require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_PASSWORD}@cluster0.cnvk9.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// console.log(uri)




const app = express()

app.use(bodyParser.json())
app.use(cors())
const port = process.env.PORT || 8500;



// console.log(process.env.DB_NAME)


app.get('/', (req, res) => {
  res.send('Ok Boss ,I Come From Chaldal Shopping')
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


client.connect(error => {

  console.log('connection err',error)

  const eventCollection = client.db("chaldalShopping").collection("addProducts");


 app.get('/events',(req,res)=>{
    eventCollection.find()
    .toArray((err,items)=>{
      res.send(items)
      // console.log('from database', items)
    })
 })

 app.get('/events/:id',(req,res)=>{
   id=objectID(req.params.id)
  eventCollection.find({_id:id})
  .toArray((err,items)=>{
    res.send(items[0])
    // console.log('from database', items)
  })
})



  app.post('/addProduct',(req,res)=>{
     const newEvent=req.body; 
     console.log('adding new event',newEvent);
     eventCollection.insertOne(newEvent)
     .then(result=>{
         console.log('inserted count',result.insertedCount);
        res.send(result.insertedCount>0)
     })
  })



//  console.log('Database Connected Successfully');

     




});


app.listen(port)