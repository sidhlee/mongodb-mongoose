const mongoose = require('mongoose');

// create a new schema object (typecasting + validation)
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
});

// export the model (node modules are singleton)
// collection name will be lowercase plural form of given model name
module.exports = mongoose.model('Product', productSchema);
