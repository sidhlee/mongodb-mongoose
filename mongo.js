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
