// import express from "express";
// import cors from "cors";
// import { MongoClient, ObjectId } from "mongodb";
// import dotenv from "dotenv";
// dotenv.config();

// const app = express();
// const port = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json());


// const uri = process.env.MONGO_URL 
// const client = new MongoClient(uri);
// const dbName = "jobDrop";

// async function run() {
//   try {
//     await client.connect();
//     console.log("MongoDB connected");

//     const db = client.db(dbName);

//     const usersCollection = db.collection("users");
//     const jobsCollection = db.collection("jobs");
//     const applicationsCollection = db.collection("applications");


//     app.post("/users", async (req, res) => {
//       const user = req.body;
//       const result = await usersCollection.insertOne(user);
//       res.send(result);
//     });

//     app.get("/users", async (req, res) => {
//       const users = await usersCollection.find().toArray();
//       res.send(users);
//     });

//     app.get("/users/:id", async (req, res) => {
//       const id = req.params.id;
//       const user = await usersCollection.findOne({ _id: new ObjectId(id) });
//       res.send(user);
//     });

//     app.post("/jobs", async (req, res) => {
//       const job = req.body;
//       const result = await jobsCollection.insertOne(job);
//       res.send(result);
//     });

//     app.get("/jobs", async (req, res) => {
//       const jobs = await jobsCollection.find().toArray();
//       res.send(jobs);
//     });

//     app.get("/jobs/:id", async (req, res) => {
//       const id = req.params.id;
//       const job = await jobsCollection.findOne({ _id: new ObjectId(id) });
//       res.send(job);
//     });

//     app.put("/jobs/:id", async (req, res) => {
//       const id = req.params.id;
//       const updatedJob = req.body;
//       const result = await jobsCollection.updateOne(
//         { _id: new ObjectId(id) },
//         { $set: updatedJob }
//       );
//       res.send(result);
//     });

//     app.delete("/jobs/:id", async (req, res) => {
//       const id = req.params.id;
//       const result = await jobsCollection.deleteOne({ _id: new ObjectId(id) });
//       res.send(result);
//     });

//     app.post("/applications", async (req, res) => {
//       const application = req.body;
//       const result = await applicationsCollection.insertOne(application);
//       res.send(result);
//     });

//     app.get("/applications", async (req, res) => {
//       const apps = await applicationsCollection.find().toArray();
//       res.send(apps);
//     });

//     app.get("/applications/:id", async (req, res) => {
//       const id = req.params.id;
//       const appData = await applicationsCollection.findOne({ _id: new ObjectId(id) });
//       res.send(appData);
//     });

//     app.get("/applications/job/:jobId", async (req, res) => {
//       const jobId = req.params.jobId;
//       const apps = await applicationsCollection.find({ jobId }).toArray();
//       res.send(apps);
//     });

//     app.get("/applications/user/:email", async (req, res) => {
//       const email = req.params.email;
//       const apps = await applicationsCollection.find({ userEmail: email }).toArray();
//       res.send(apps);
//     });

//     app.get("/", (req, res) => {
//       res.send("jobDrop server is running...");
//     });

//     app.listen(port, () => {
//       console.log(`Server is running on port ${port}`);
//     });
//   } catch (err) {
//     console.error("Error:", err);
//   }
// }

// run();
