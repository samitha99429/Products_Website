import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../redux/slices/productSlice';
import { selectFavoritedProducts } from '../redux/selectors';
import { Table, Space, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { EditFilled, DeleteFilled, StarFilled, StarOutlined } from '@ant-design/icons';

const { Column } = Table;

function FavoritesPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const favoritedProducts = useSelector(selectFavoritedProducts);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleEdit = (productId) => {
    navigate(`/edit-product/${productId}`);
  };

  const handleDelete = (productId) => {
   
  };

  const toggleFavorite = (productId, isFavorite) => {
    dispatch(toggleFavorite({ id: productId, isFavorite: !isFavorite }));
  };

  return (
    <div className="container">
      <h2>Favorited Products</h2>
      <Table dataSource={favoritedProducts} rowKey="_id">
        <Column title="SKU" dataIndex="sku" key="sku" />
        <Column
          title="Image"
          dataIndex="mainImage"
          key="mainImage"
          render={(imageUrl) => <img src={`http://localhost:3001${imageUrl}`} alt="Product" width={50} />}
        />
        <Column title="Product Name" dataIndex="name" key="name" />
        <Column title="Price" dataIndex="price" key="price" />
        <Column
          title="Actions"
          key="actions"
          render={(_, record) => (
            <Space size="large">
              <DeleteFilled style={{ color: '#001EB1' }} onClick={() => handleDelete(record._id)} />
              <EditFilled style={{ color: '#001EB1' }} onClick={() => handleEdit(record._id)} />
              {record.favorite ? (
                <StarFilled style={{ color: '#FFD700' }} onClick={() => toggleFavorite(record._id, record.favorite)} />
              ) : (
                <StarOutlined style={{ color: '#001EB1' }} onClick={() => toggleFavorite(record._id, record.favorite)} />
              )}
            </Space>
          )}
        />
      </Table>
    </div>
  );
}

export default FavoritesPage;
