const express =require("express");
const cors=require("cors");
const jwt =require('jsonwebtoken');
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

function verifyjwt(req,res,next){
 const authHeader=req.headers.authorization;
 if(!authHeader){
    res.status(401).send({message:'unauthorized'})
 }
 const token= authHeader.split(' ')[1];
 jwt.verify(token, process.env.ACCESS_TOKEN_S,function(err,decoded){
    if(err){
     res.status(401).send({message:'unauthorized'})
    }
    req.decoded=decoded;
    next();
 })
}

async function run(){
    try{
        const servicesCollection=client.db('service_review').collection('services');
        const reviewCollection=client.db('service_review').collection('reviews');

        app.post('/jwt',(req,res)=>{
        const user= req.body; 
        console.log(user); 
        const token =jwt.sign (user, process.env.ACCESS_TOKEN_S)
        res.send({token});     
    })

        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = servicesCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        // reviews
        app.post('/reviews', verifyjwt, async (req, res) => {
            const r = req.body;
            const result = await reviewCollection.insertOne(r);
            res.send(result);
        });
        app.get('/reviews',verifyjwt, async (req, res) => {
            const decoded=req.decoded;
            console.log(decoded);
            const query = {};
            
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