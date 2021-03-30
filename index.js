const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
// const router = express.Router();

const app = express();

app.use(express.json());
app.use(cors());

const port = 5000;

const uri = `mongodb+srv://emJhon:emaJhon39@cluster0.cpqmt.mongodb.net/emJhonServer?retryWrites=true&w=majority`;

// console.log(process.env.DB_USER);

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const products = client.db("emaJhonServer").collection("products");
  const ordersCollection = client.db("emaJhonServer").collection("orders");

  app.post("/addProduct", (req, res) => {
    try {
        const product = req.body;
        console.log(product);
      products.insertOne(product)
      .then((result) => {
      res.send(result.insertedCount);
      });
    } catch (error) {
      res.send(error)
    }
  });

  app.get('/products', (req, res) => {
    products.find({})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  app.get('/product/:key',(req, res) => {
    products.find({key: req.params.key})
    .toArray((err, documents) => {
      res.send(documents[0]);
    })
  })

  app.post('  ', (req, res) => {
    const productsKeys = req.body;
    products.find({key:{ $in: productsKeys }})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  app.post('/addOrder', (req, res)=>{
    const order = req.body;
    ordersCollection.insertOne(order)
    .then(result =>{
        console.log(result.insertedCount);
        res.send(result.insertedCount > 0 )
    })
  })

  console.log("Database Connected");
  console.log("Server Ready for use");
});

app.listen(process.env.PORT || port, () => {
  console.log(`Port at http://localhost:${port}`);
});
