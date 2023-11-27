const express = require("express");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
//middleware setup
app.use(cors());
app.use(express.json()); //convirt data to json format

//mpngodb connect
const { MongoClient } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v0ciw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();

    console.log("Connected successfully to mogodb  server");
    const database = client.db("carShop");
    const productCollection = database.collection("productCollection");
    const orderCollection = database.collection("Orders");
    const usersCollection = database.collection("Users");
    const reviewCollection = database.collection("UserReview");

    //get api for get data  in my backend database
    app.get("/products", async (req, res) => {
      const cursor = productCollection.find({});
      const products = await cursor.toArray();
      res.json(products);
    });

    //insert product
    app.post("/products", async (req, res) => {
      const newProducts = req.body;
      // console.log(newProducts);
      const result = await productCollection.insertOne(newProducts);

      //  console.log("user order information", result);
      res.json(result);
    });
    //delete products
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      console.log("delte order id", id);
      const query = { _id: ObjectId(id) };
      const result = await productCollection.deleteOne(query);
      //  console.log("deleting count", result);
      res.json(result);
    });

    //get api for  get data from database
    app.get("/orders", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      // console.log(query);
      const cursor = orderCollection.find(query);
      const allOrders = await cursor.toArray();

      res.json(allOrders);
    });

    //get api for all orders
    app.get("/allorders", async (req, res) => {
      const email = req.query.email;
      const query = {};
      // console.log(query);
      const cursor = orderCollection.find(query);
      const allOrders = await cursor.toArray();

      res.json(allOrders);
    });

    app.delete("/allorders/:id", async (req, res) => {
      const id = req.params.id;
      console.log("delte order id", id);
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      //console.log("deleting count", result);
      res.json(result);
    });
    //post api to set order data in mongodb database
    app.post("/orders", async (req, res) => {
      const newOrders = req.body;
      // console.log(newOrders);
      const result = await orderCollection.insertOne(newOrders);

      console.log("user order information", result);
      res.json(result);
    });
    //delete order
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      console.log("delte order id", id);
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      //console.log("deleting count", result);
      res.json(result);
    });
    //get api for individual user
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      // console.log(query);
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      //console.log(services);
      res.json({ admin: isAdmin });
    });

    //sytem use update or add

    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });
    //upadate or add admin in database
    app.put("/users/admin", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };

      const updateDoc = { $set: { role: "admin" } };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.json(result);
    });
    //insert user review
    app.post("/review", async (req, res) => {
      const review = req.body;
      // console.log(review);
      const result = await reviewCollection.insertOne(review);

      //   console.log("user order information", result);
      res.json(result);
    });

    // get all user review
    app.get("/review", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      // console.log(query);
      const cursor = reviewCollection.find(query);
      const allReview = await cursor.toArray();
      //console.log(services);
      res.json(allReview);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`server running in `, port);
});
