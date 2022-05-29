const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const objectId = require('mongodb').ObjectId
var cors = require('cors')
const app = express()
const jwt = require('jsonwebtoken');
app.use(cors())
app.use(express.json())
require('dotenv').config();
const port = process.env.PORT || 4000;

// connect to mongo
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aerj3.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// verify JWT
function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'UnAuthorized access.' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'Forbidden access' })
        }
        req.decoded = decoded;
        next();
    });
}

// connect the database table
async function run() {
    try {
        await client.connect();
        const partsCollection = client.db('niksmotoDB').collection('partsCollection');
        const orderCollection = client.db('niksmotoDB').collection('orderCollection');
        const userCollection = client.db('niksmotoDB').collection('userCollection');
        const reviewCollection = client.db('niksmotoDB').collection('reviewCollection');
   

        // get data from mongo db
        app.get('/products', async (req, res) => {
            const query = {}
            const cursor = partsCollection.find(query)
            const db = await cursor.toArray()
            res.send(db)
        })

        // get data via params
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: objectId(id) }
            const cursor = partsCollection.find(query)
            const db = await cursor.toArray()
            res.send(db)
        })

        
        // post data to Mongo DB
        app.post('/products', async (req, res) => {
            const product = req.body
            const result = await database.insertOne(product)
            res.send({ ack: "product added to server" })
        })

    } finally {

    }

}
run().catch(console.dir);

// check the server..............
app.get('/', (req, res) => {
    res.send("Running niksmoto!")
})

app.listen(port, () => {
    console.log("Listening port 4000")
})