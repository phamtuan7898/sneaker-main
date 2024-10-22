const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://haydygame:24HqXHnUuyIMvJJo@cluster0.bpo9e.mongodb.net/')
  .then(() => {
    console.log('Connected to MongoDB');
  }).catch((err) => {
    console.error('MongoDB connection error:', err);
});

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  img: { type: String }, // Store avatar image URL or path
});

// Product Schema
const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  shoeType: { type: String, required: true },
  image: [String], // Updated to array of strings for multiple images
  price: { type: String, required: true },
  rating: { type: Number, required: true },
  description: { type: String, required: true },
  color: [String], // Array of color strings
  size: [String],  // Array of size strings
});

// Cart Schema
const cartItemSchema = new mongoose.Schema({
  id: { type: String, required: true }, // Product ID
  productName: { type: String, required: true },
  price: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
});

const CartItem = mongoose.model('CartItem', cartItemSchema);
const Product = mongoose.model('Product', productSchema);
const User = mongoose.model('User', userSchema);

// Register User
app.post('/register', async (req, res) => {
  const { username, password, email, img } = req.body;
  try {
    const newUser = new User({ username, password, email, img });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Error registering user' });
  }
});

// User Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ username: username }, { email: username }],
    });

    if (!user || user.password !== password) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    res.json(user); // Return the user including the image (if any)
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Forgot Password (send reset email)
app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      // Implement password reset logic (e.g., sending email)
      res.json({ message: 'Reset password link has been sent to your email.' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error handling forgot password:', error);
    res.status(500).json({ error: 'Error handling forgot password' });
  }
});

// Add new product
app.post('/products', async (req, res) => {
  const { productName, shoeType, image, price, rating, description, color, size } = req.body;
  try {
    const newProduct = new Product({ 
      productName, 
      shoeType, 
      image,  // Now accepting array of image URLs
      price, 
      rating, 
      description, 
      color,  // Now accepting array of colors
      size    // Now accepting array of sizes
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Error adding product' });
  }
});

// Get list of products
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Error fetching products' });
  }
});
// Add new cart item
app.post('/cart', async (req, res) => {
  const { id, productName, price, quantity } = req.body;
  try {
    const newCartItem = new CartItem({ id, productName, price, quantity });
    await newCartItem.save();
    res.status(201).json(newCartItem);
  } catch (error) {
    console.error('Error adding cart item:', error);
    res.status(500).json({ error: 'Error adding cart item' });
  }
});

// Get list of cart items
app.get('/cart', async (req, res) => {
  try {
    const cartItems = await CartItem.find();
    res.json(cartItems);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ error: 'Error fetching cart items' });
  }
});

// Delete cart item
app.delete('/cart/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await CartItem.findOneAndDelete({ id });
    if (result) {
      res.status(200).json({ message: 'Cart item deleted successfully' });
    } else {
      res.status(404).json({ message: 'Cart item not found' });
    }
  } catch (error) {
    console.error('Error deleting cart item:', error);
    res.status(500).json({ error: 'Error deleting cart item' });
  }
});

// Update cart item quantity
app.put('/cart/:id', async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body; // Expecting the new quantity in the request body
  try {
    const updatedCartItem = await CartItem.findOneAndUpdate(
      { id }, // Filter by id
      { quantity }, // Update quantity
      { new: true } // Return the updated document
    );
    if (updatedCartItem) {
      res.status(200).json(updatedCartItem);
    } else {
      res.status(404).json({ message: 'Cart item not found' });
    }
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    res.status(500).json({ error: 'Error updating cart item quantity' });
  }
});



// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
