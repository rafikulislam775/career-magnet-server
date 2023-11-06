const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 5001;
//middleware
// app.use(cors());
app.use(express.json());
app.use(cors({
  origin:'http://localhost:5173',
  credentials:true
}))

//career-magnet
//w7UXO5ImD9UD2R6L

//add mongo DB connection

const uri =
  "mongodb+srv://career-magnet:w7UXO5ImD9UD2R6L@cluster0.hfblnyz.mongodb.net/?retryWrites=true&w=majority";
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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    //create a collection 01
    const jobCollection = client.db("Career-MagnetDB").collection("allJobs");
    //get the inserted data
    app.get("/allJobs", async (req, res) => {
      const cursor = jobCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
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
  res.send("server is running");
});
app.listen(port, () => {
  console.log(`car doctor is running on port ${port}`);
});
