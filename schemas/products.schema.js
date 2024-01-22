import mongoose from 'mongoose';

const productsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: 'FOR_SALE',
  },
  createdAt: {
    type: Date,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export default mongoose.model('products', productsSchema);
