const express =require("express");
const cors=require("cors");
const app= express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port =process.env.PORT||5000;
require('dotenv').config();

app.use(cors());
app.use(express.json());

// console.log(process.env.DB_USER);
// console.log(process.env.DB_PASS);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bu444bw.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const servicesCollection=client.db('service_review').collection('services');
        const reviewCollection=client.db('service_review').collection('reviews');

        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = servicesCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        // reviews
        app.post('/reviews', async (req, res) => {
            const r = req.body;
            const result = await reviewCollection.insertOne(r);
            res.send(result);
        });
        app.get('/reviews', async (req, res) => {
            const query = {}
            const cursor = reviewCollection.find(query);
            const r = await cursor.toArray();
            res.send(r);
        });
    }
    finally{

    }

}
run().catch(er=>console.error(er));


app.get('/',(req,res)=>{
    res.send("Server is running");
})

app.listen(port,()=>{
    console.log(`Server is On ${port}`);
})