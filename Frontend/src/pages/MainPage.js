import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, deleteProduct, toggleFavorite } from '../redux/slices/productSlice';
import { Input, Button, Table, Space, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { EditFilled, DeleteFilled, StarFilled, StarOutlined } from '@ant-design/icons';

const { Column } = Table;

function MainPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector((state) => state.products.items);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const showDeleteConfirm = (productId) => {
    setSelectedProductId(productId); 
    setIsModalVisible(true);
  };

  const toggleFavoriteHandler = (productId, currentFavoriteStatus) => {
    dispatch(toggleFavorite({ id: productId, isFavorite: !currentFavoriteStatus }));
  };


  const handleDelete = async () => {
    if (selectedProductId) {
      await dispatch(deleteProduct(selectedProductId)); 
      setIsModalVisible(false); 
      setSelectedProductId(null); 
    }
  };

  const handleSearch = (value) => {
    navigate(`/search?q=${value}`);
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Input.Search
  placeholder="Search products"
  enterButton={<Button style={{ backgroundColor: '#001EB1', color: '#ffffff' }}>Search</Button>}
  size="large"
  onSearch={handleSearch}
  style={{ width: 360, marginBottom: '20px' }}
/>

        <Button 
          style={{ backgroundColor: '#001EB1', color: '#ffffff' }} 
          onClick={() => navigate('/add-product')}
        >
          New Product
        </Button>
      </div>
      <Table dataSource={products} rowKey="_id">
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
              <DeleteFilled style={{ color: '#001EB1' }} onClick={() => showDeleteConfirm(record._id)} />
              <EditFilled style={{ color: '#001EB1' }} onClick={() => navigate(`/edit-product/${record._id}`)} />
{record.isFavorite ? (
            <StarFilled
              style={{ color: '#001EB1' }}
              onClick={() => toggleFavoriteHandler(record._id, record.isFavorite)}
            />
          ) : (
            <StarOutlined
              style={{ color: '#001EB1' }}
              onClick={() => toggleFavoriteHandler(record._id, record.isFavorite)}
            />
          )}     </Space>
          )}
        />
      </Table>
      <Modal
        title="Confirm Deletion"
        visible={isModalVisible}
        onOk={handleDelete}
        onCancel={() => setIsModalVisible(false)}
        okText="Delete"
        okButtonProps={{ style: { backgroundColor: 'red', borderColor: 'red' } }}
        cancelText="Cancel"
      >
        <p>You will not be able to undo this action after proceed?</p>
      </Modal>
    </div>
  );
}

export default MainPage;
