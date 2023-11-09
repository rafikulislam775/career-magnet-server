const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5001;
//middleware
// app.use(cors());
app.use(express.json());
app.use(
  cors({
    origin: [
      // "http://localhost:5173"
      " https://career-magnet.web.app/",
      "https://career-magnet.firebaseapp.com/",
    ],
    credentials: true,
  })
);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hfblnyz.mongodb.net/?retryWrites=true&w=majority`;
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
    // await client.connect();

    //create a collection 01
    const jobCollection = client.db("Career-MagnetDB").collection("allJobs");
    const applications = client
      .db("Career-MagnetDB")
      .collection("applications");
    //get the inserted data
    app.get("/allJobs", async (req, res) => {
      const cursor = jobCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // data get by id
    app.get("/jobDetails/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await jobCollection.findOne(query);
      res.send(result);
    });

    //find data for update (01.1)
    app.get("/updateJob/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await jobCollection.findOne(query);
      res.send(result);
      console.log(result);
    });
    //update or edit self posting job; (01.2)  1st you need to find data whice one you want to update
    app.put("/updateJob/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };
      const updateJob = req.body;
      const job = {
        $set: {
          img: updateJob.img,
          name: updateJob.name,
          title: updateJob.title,
          category: updateJob.category,
          postingDate: updateJob.postingDate,
          applicationDeadline: updateJob.applicationDeadline,
          salaryRange: updateJob.salaryRange,
          longDetails: updateJob.longDetails,
          jobApplicantsNumber: updateJob.jobApplicantsNumber,
        },
      };
      const result = await jobCollection.updateOne(filter, job, option);
      res.send(result);
    });
    //data inserted by id
    app.post("/applyJob", async (req, res) => {
      const application = req.body;
      const result = await applications.insertOne(application);
      res.send(result);
      // console.log(result);
    });
    //Add job by users self
    app.post("/addJob", async (req, res) => {
      const allJobs = req.body;
      const result = await jobCollection.insertOne(allJobs);
      res.send(result);
      // console.log(result);
    });
    //get application
    app.get("/applyJob", async (req, res) => {
      const cursor = applications.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    //remove application jobs
    app.delete("/applyJob/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await applications.deleteOne(query);
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
  res.send("server is running");
});
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
