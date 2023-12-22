const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// config
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.50udlth.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const tasksCollection = client.db("TaskManagementSystem").collection("todos");





    // =======products========
    //  Create a new task
    app.post("/tasks", async (req, res) => {
      try {
        const tasks = req.body;
        
        const newTask = {
          title: tasks.title,
          description: tasks.description,
          finishDate: tasks.date,
          priority: tasks.priority,
          status: tasks.status || 'todo',
          createdAt: new Date(),
        };
        console.log(newTask)
        const result = await tasksCollection.insertOne(newTask);
        res.send(result);
      } catch (error) {
        res.status(500).send(error);
      }
    });

    // all products items
    app.get("/tasks", async (req, res) => {
      const cursor = tasksCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    // Get a single products item
    app.get("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      if (id.length < 24) {
        res.status(400).send("Invalid ID");
        return;
      }
      const query = { _id: new ObjectId(id) };
      const product = await tasksCollection.findOne(query);
      res.send(product);
    });

    // Delete a single products item
    app.delete("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await tasksCollection.deleteOne(query);
      res.send(result);
    });

    // update a single products item
    app.put("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      if (id.length < 24) {
        res.status(400).send("Invalid ID");
        return;
      }
      const query = { _id: new ObjectId(id) };
      const tasks = req.body;
      const updateDoc = {
        $set: {
          title: tasks.title,
          description: tasks.description,
          finishDate: tasks.date,
          priority: tasks.priority,
          status: tasks.status,
        },
      };
      const result = await tasksCollection.updateOne(query, updateDoc);
      res.send(result);
    });




    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("TMS Confirmed!");
});

app.listen(port, () => {
  console.log(`TMS listening at http://localhost:${port}`);
});
