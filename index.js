const express = require("express");
const cors=require("cors");
const app= express();
const port =process.env.PORT||5000;


app.use(cors());
app.use(express.json());

app.get('/',(res,req)=>{
    res.setEncoding("Server is running");
})

app.listen(port,()=>{
    console.log(`Server is On ${port}`);
})