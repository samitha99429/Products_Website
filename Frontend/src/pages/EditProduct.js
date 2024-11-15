import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, updateProduct, fetchProducts } from '../redux/slices/productSlice';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import '../assets/styles/editProduct.css';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const product = useSelector((state) => state.products.items.find((p) => p._id === id));
  
  const [form] = Form.useForm();
  const [existingImages, setExistingImages] = useState([]);
  const [mainImage, setMainImage] = useState('');
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    if (!product) {
      dispatch(fetchProductById(id));
    } else {
      form.setFieldsValue({
        sku: product.sku,
        name: product.name,
        quantity: product.quantity,
        price: product.price,
        description: product.description,
      });
      setExistingImages(product.images || []);
      setMainImage(product.mainImage);
    }
  }, [dispatch, id, product, form]);

  const handleImageChange = ({ fileList }) => {
    const validFiles = fileList.filter((file) =>
      file.type === 'image/jpeg' || file.type === 'image/png'
    );
    if (validFiles.length !== fileList.length) {
      message.error('Only JPEG and PNG images are allowed.');
    }
    setNewImages(validFiles);
  };

  const handleDeleteImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const handleSetMainImage = (url) => {
    setMainImage(url);
  };

  const handleSubmit = async (values) => {
    if (existingImages.length === 0 && newImages.length === 0) {
      message.error('Please upload at least one image.');
      return;
    }

    const formData = new FormData();
    formData.append('sku', values.sku);
    formData.append('name', values.name);
    formData.append('quantity', values.quantity);
    formData.append('price', values.price);
    formData.append('description', values.description);
    formData.append('mainImage', mainImage);

    newImages.forEach((image) => formData.append('images', image.originFileObj));
    existingImages.forEach((url) => formData.append('existingImages', url));

    await dispatch(updateProduct({ id, formData }));
    await dispatch(fetchProducts());
    message.success('Product updated successfully!');
    navigate('/');
  };

  return (
    <div className="edit-container mt-12">
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="horizontal"
        variant='filled'
        
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
        >
          <Input placeholder="Enter Product Name" />
        </Form.Item>

        <Form.Item
          name="quantity"
          label="Quantity"
          rules={[{ required: true, message: 'Please enter the quantity!' }]}
        >
          <Input type="number" placeholder="Enter Quantity" />
        </Form.Item>
        <Form.Item
          name="price"
          label="Price"
          rules={[{ required: true, message: 'Please enter the Price!' }]}
        >
          <Input type="number" placeholder="Enter price" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please enter a description!' }]}
        >
          <Input.TextArea placeholder="Enter Description" rows={4} />
        </Form.Item>

        <Form.Item label="Existing Images">
          <div style={{ display: 'flex', gap: '10px' }}>
            {existingImages.map((image, index) => (
              <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
                <img
                  src={`http://localhost:3001${image}`}
                  alt={`Product ${index}`}
                  style={{
                    width: '100px',
                    height: '100px',
                    objectFit: 'cover',
                    border: mainImage === image ? '2px solid blue' : '1px solid gray',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleSetMainImage(image)}
                />
                <button
                  type="button"
                  onClick={() => handleDeleteImage(index)}
                  style={{
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    background: 'red',
                    color: 'white',
                    borderRadius: '50%',
                    cursor: 'pointer',
                  }}
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </Form.Item>

        <Form.Item
          label="Add New Images"
          rules={[{ required: true, message: 'Please upload at least one image!' }]}
        >
          <Upload
            multiple
            beforeUpload={() => false}
            onChange={handleImageChange}
            accept="image/jpeg, image/png"
          >
            <Button icon={<UploadOutlined />}>Upload New Images</Button>
          </Upload>
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          style={{
            width: '120px',
            backgroundColor: '#001EB1',
            alignSelf: 'flex-end',
          }}
        >
          Update Product
        </Button>
      </Form>
    </div>
  );
};

export default EditProduct;
