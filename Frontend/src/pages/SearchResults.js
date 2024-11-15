
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/productSlice';
import { Descriptions, Button, Space } from 'antd';
import { EditFilled, DeleteFilled, StarFilled, StarOutlined } from '@ant-design/icons';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResults() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.items);
  const query = useQuery().get("q");
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    } else {
      setFilteredProducts(
        products.filter((product) =>
          product.name.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  }, [dispatch, products, query]);

  const handleDelete = (productId) => {
   
    console.log(`Delete product with ID: ${productId}`);
  };

  const handleEdit = (productId) => {
    console.log(`Edit product with ID: ${productId}`);
  };

  const handleFavoriteToggle = (productId) => {
    console.log(`Toggle favorite for product with ID: ${productId}`);
  };

  return (
    <div className="container">
      <h1>Search Results for "{query}"</h1>

      {filteredProducts.length > 0 ? (
        filteredProducts.map((product) => (
          <div key={product._id} style={{ marginBottom: '20px' }}>
              <Descriptions title={`Product: ${product.name}`} bordered column={1}>
            <Descriptions.Item label="Product Name">{product.name}</Descriptions.Item>
          
              <Descriptions.Item label="SKU">{product.sku}</Descriptions.Item>
              <Descriptions.Item label="Description">{product.description}</Descriptions.Item>
              
    
            </Descriptions>
          </div>
        ))
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
}

export default SearchResults;

