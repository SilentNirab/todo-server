const express = require('express');
const cros = require('cors');
require(`dotenv`).config();
const app = express();
const port = process.env.PROT || 5000;

// midelware
app.use(cros());
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://Task:057UhOy9U6sFlMtG@cluster0.ezxu64p.mongodb.net/?retryWrites=true&w=majority";

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

    const TasksCollection = client.db('TaskCollection').collection('task')

    app.get('/task', async (req, res) => {
      const cursor = TasksCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    app.get('/task/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await TasksCollection.findOne(query);
      res.send(result)
    })

    app.post('/task', async (req, res) => {
      const todo = req.body;
      const result = await TasksCollection.insertOne(todo);
      res.send(result);
    })
    app.delete('/task/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await TasksCollection.deleteOne(query);
      res.send(result);
    })
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Tasks is running');
})

app.listen(port, () => {
  console.log(`Tasks is running on prot : ${port}`);
})
