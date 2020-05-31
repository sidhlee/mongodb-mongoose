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
