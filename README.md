# MongoDB & Mongoose

A quick review on working with Mongoose & MongoDB in node/express application.

## /app.js

```js
const express = require('express');
const bodyParser = require('body-parser');
const mongoPractice = require('./mongoose');

const app = express();

app.use(bodyParser.json());

app.post('/products', mongoPractice.createProduct);

app.get('/products', mongoPractice.getProducts);

app.listen(5050);
```

## /mongo.js

```js
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;

const createProduct = async (req, res, next) => {
  const newProduct = {
    name: req.body.name,
    price: req.body.price,
  };
  // 1. create a new MongoClient instance
  const client = new MongoClient(process.env.MONGO_URI, {
    useUnifiedTopology: true,
  });

  try {
    await client.connect(); // 2. open connection
    const db = client.db(); // 3. connect to db (specified in connection string)
    // 4. insert a doc to the collection we provide
    const result = await db.collection('products').insertOne(newProduct);
  } catch (err) {
    return res.json({ message: 'Could not store data.' });
  }
  // 5. close the connection
  client.close();

  res.json(newProduct);
};

const getProducts = async (req, res, next) => {
  const client = new MongoClient(process.env.MONGO_URI, {
    useUnifiedTopology: true,
  });
  let products;
  try {
    await client.connect();
    const db = client.db();
    // find() returns a cursor from which we can iterate
    products = await db.collection('products').find().toArray();
  } catch (err) {
    return res.json({ message: 'Could not retrieve products.' });
  }

  client.close();

  res.json(products);
};

exports.createProduct = createProduct;
exports.getProducts = getProducts;
```

## /models/product.js

```js
const mongoose = require('mongoose');

// create a new schema object (typecasting + validation)
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
});

// export the model (node modules are singleton)
// collection name will be lowercase plural form of given model name
module.exports = mongoose.model('Product', productSchema);
```

## /mongoose.js

```js
require('dotenv').config();
const mongoose = require('mongoose');

const Product = require('./models/product');

// All connections are managed by mongoose (open/close for each request)
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }) // returns Promise
  .then(() => console.log('Connected to db'))
  .catch(() => {
    console.log('Connection failed!');
  });

const createProduct = async (req, res, next) => {
  const createdProduct = new Product({
    name: req.body.name,
    price: req.body.price,
  });

  // _id is populated inside new product when it's created from the model
  console.log(createdProduct);
  /*
  { _id: 5ed2fb115521603355649e8e, // ObjectId object
    name: 'Nintendo DS Lite',
    price: 200.99 }
  */

  // mongoose's virtual getter converts ObjectId into a string!
  // productSchema.virtual('id').get(() => return this._id.str)
  console.log(typeof createdProduct.id);

  // connects to the db & insert to the collection (lowercase pluralized form of model)
  const result = await createdProduct.save();

  res.json(result);
};

const getProducts = async (req, res, next) => {
  // query documents on the Model
  // and returns thenable array(Query object)!
  // If you want cursor like mongodb's find, use .cursor()
  const products = await Product.find().exec(); // exec() to Promisify

  res.json(products);
};

exports.createProduct = createProduct;
exports.getProducts = getProducts;
```
