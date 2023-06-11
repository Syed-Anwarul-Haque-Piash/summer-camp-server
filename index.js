const express = require('express')
const cors=require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
//app.use(cors());
app.use(express.json());
const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
}
app.use(cors(corsOptions))
app.use(express.json())
//Amping
//CBOWMU7KdvC5GwaG

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.4doag.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const usersCollection=client.db('Amping').collection('users');
    const classesCollection=client.db('Amping').collection('classes');
    const instructorCollection=client.db('Amping').collection('instructors');
    const addtocartCollection=client.db('Amping').collection('addtocart');

    app.put('/users/:email',async(req,res)=>{
        const email=req.params.email;
        const user=req.body;
        const query={email:email}
        const options={upsert:true}
        const updateDoc={
            $set:user
        }
        const result=await usersCollection.updateOne(query,updateDoc, options);
        res.send(result)
    })
    app.get('/users',async(req,res)=>{
      const result=await usersCollection.find({}).toArray();
      res.send(result);
    })

    app.post('/classes',async(req,res)=>{
      const classes=req.body;
      const result=await classesCollection.insertOne(classes);
      res.send(result); 
    });
    app.post('/instructor',async(req,res)=>{
      const instructor=req.body;
      const result=await instructorCollection.insertOne(instructor);
      res.send(result);
    })
    app.get('/instructor',async(req,res)=>{
      const result=await instructorCollection.find({}).toArray();
      res.send(result);
    });
    //showing individual class data

    app.get("/classes/:email", async (req, res) => {
      const email = req.params.email;
      const result = await classesCollection.find({email: email,}).toArray();
      res.send(result);
    });

    app.get('/classes',async(req,res)=>{
      const result=await classesCollection.find({}).toArray();
      res.send(result);
    });
    app.get('/classes/:id',async(req,res)=>{
      const id = req.params.id 
      const query = {_id:new ObjectId(id)}
      const result = await classesCollection.findOne(query)
      res.send(result)
    });

    //approve class admin dashboard
    app.patch("/class/approve/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          status: "approved",
        },
      };
      const result = await classesCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    app.patch("/class/deny/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          status: "denied",
        },
      };
      const result = await classesCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    //get data by status

    app.get("/approvedClasses", async (req, res) => {
      const status = req.query.status;
      console.log(status);
      const result = await classesCollection.find({ status: status }).toArray();

      res.send(result);
    });

    app.put('/feedback/:id',async(req,res)=>{
      const id=req.params.id;
      console.log(id);
      const body=req.body;
      const query={_id:new ObjectId(id)}
      const updateDoc={
        $set: {
          feedback:body
        }
      }
      const result=await classesCollection.updateOne(query,updateDoc)
      console.log(result)
      res.send(result);
    })


    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.send(result);
  })

  app.patch('/users/admin/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
          $set: {
              role: 'admin'
          },
      };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.send(result);
  })

  app.patch('/users/instructor/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
          $set: {
              role: 'instructor'
          },
      };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.send(result);
  })
  //addtocart
  app.post('/addtocart',async(req,res)=>{
    const info=req.body;
    const result=await addtocartCollection.insertOne(info);
    res.send(result);
  })
  app.get('/addtocart',async(req,res)=>{
    const result=await addtocartCollection.find({}).toArray();
    res.send(result);
  })

  

   
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!I am comming')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})