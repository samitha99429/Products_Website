
const express = require('express');
const {
  addProduct,
  editProduct,
  deleteProduct,
  getProducts,
  setFavorite
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { multipleUpload } = require('../middleware/multerConfig'); 

const router = express.Router();

router.route('/')
  .post(protect, multipleUpload, addProduct) 
  .get(getProducts); 

router.route('/:id')
  .put(protect, multipleUpload, editProduct) 
  .delete(protect, deleteProduct); 
  
router.route('/:id/favorite')
  .put(protect, setFavorite);

module.exports = router;


