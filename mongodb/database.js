const { MongoClient } =require("mongodb");
const url= "mongodb://localhost:27017/";
const client=new MongoClient(url);
async function createUser(){
    try{
        await client.connect();
        const db=client.db("mydb");
        const collection=db.collection("sa");
        await collection.insertOne({name:"poori" ,age:10});
        console.log("1 document inserted");
    }
    catch(err)
    {
        console.log(err);
    }
    finally{
        await client.close();

    }
    }

createUser();