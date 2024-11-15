
const Product = require('../models/productModel');


const addProduct = async (req, res) => {
    try {
      
  
      const { sku, name, quantity, price,description} = req.body;
      const images = req.files.map(file => `/uploads/${file.filename}`);
  
      const product = await Product.create({
        sku,
        name,
        quantity,
        price,
        description,
        images,
        mainImage: images[0],
        user: req.user.id,
      });
      res.status(201).json(product);
    } catch (error) {
      console.error("Error adding product:", error); 
      if (error.code === 11000) {
        return res.status(400).json({ message: "SKU must be unique" });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
const editProduct = async (req, res) => {
  try {
    const { sku, name, quantity,price, description, mainImage, existingImages = [] } = req.body;

    const newImages = req.files.map(file => `/uploads/${file.filename}`);
    const allImages = [...existingImages, ...newImages];

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { sku, name, quantity,price, description, images: allImages, mainImage },
      { new: true }
    );

    res.json(product);
  } catch (error) {
    console.error("Error editing product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


const toggleFavorite = async (req, res) => {
  try {
    const { id } = req.params;  
    const { favorite } = req.body; 
    
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { favorite },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error updating favorite status', error });
  }
};



const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const setFavorite = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    
    product.isFavorite = !product.isFavorite;
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addProduct, editProduct, deleteProduct, getProducts, setFavorite };
