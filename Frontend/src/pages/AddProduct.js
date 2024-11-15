import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addProduct } from '../redux/slices/productSlice';
import { Form, Input, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/addProduct.css';

const AddProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const [form] = Form.useForm();
  const [images, setImages] = useState([]);

  const handleImageChange = ({ fileList }) => {
    const validFiles = fileList.filter((file) =>
      file.type === 'image/jpeg' || file.type === 'image/png'
    );
    if (validFiles.length !== fileList.length) {
      message.error('Only JPEG and PNG images are allowed.');
    }
    setImages(validFiles);
  };

  const handleSubmit = (values) => {
    if (images.length === 0) {
      message.error('Please upload at least one image.');
      return;
    }

    const formData = new FormData();
    formData.append('sku', values.sku);
    formData.append('name', values.name);
    formData.append('quantity', values.quantity);
    formData.append('price', values.price);
    formData.append('description', values.description);

    images.forEach((image) => formData.append('images', image.originFileObj));
    dispatch(addProduct(formData))
      .then(() => {
        message.success('Product added successfully!');
        navigate('/');
      })
      .catch(() => {
        message.error('Failed to add product. Please try again.');
      });
  };

  return (
    <div className="add-container mt-12">
      <Form
        form={form}
        onFinish={handleSubmit}
        variant="filled"
        layout="horizontal"
        initialValues={{
          sku: '',
          name: '',
          quantity: 1,
          price: 0,
          description: '',
        }}
      >
        <Form.Item
          name="sku"
          label="SKU"
          rules={[{ required: true, message: 'Please enter the SKU!' }]}
        >
          <Input placeholder="Enter SKU" />
        </Form.Item>

        <Form.Item
          name="name"
          label="Product Name"
          rules={[{ required: true, message: 'Please enter the product name!' }]}
          style={{
            display: 'inline-block',
            width: 'calc(50% - 8px)',
          }}
        >
          <Input placeholder="Enter Product Name" />
        </Form.Item>

        <Form.Item
          name="quantity"
          label="Quantity"
          rules={[{ required: true, message: 'Please enter the quantity!' }]}
          style={{
            display: 'inline-block',
            width: 'calc(50% - 8px)',
          }}
        >
          <Input placeholder="Enter quantity" />
        </Form.Item>
        <Form.Item
          name="price"
          label="Price"
          rules={[{ required: true, message: 'Please enter the price!' }]}
          style={{
            display: 'inline-block',
            width: 'calc(50% - 8px)',
          }}
        >
          <Input placeholder="Enter Price" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please enter a description!' }]}
        >
          <Input.TextArea placeholder="Enter Description" rows={4} />
        </Form.Item>

        <Form.Item
          label="Product Images"
          rules={[{ required: true, message: 'Please upload at least one image!' }]}
        >
          <Upload
            multiple
            beforeUpload={() => false} 
            onChange={handleImageChange}
            accept="image/jpeg, image/png"
          >
            <Button icon={<UploadOutlined />}>Upload Images</Button>
          </Upload>
        </Form.Item>

        <div className="add-btn">
          <Button
            type="primary"
            htmlType="submit"
            style={{
              width: '120px',
              backgroundColor: '#001EB1',
              alignSelf: 'flex-end',
              justifySelf: 'flex-end',
            }}
          >
            Add Product
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddProduct;
