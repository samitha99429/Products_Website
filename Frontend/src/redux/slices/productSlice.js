import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const getAuthToken = () => localStorage.getItem('token');


export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const response = await api.get('/products');
  return response.data;
});


export const fetchProductById = createAsyncThunk('products/fetchProductById', async (id) => {
    const token = getAuthToken();
    const response = await api.get(`/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  });


export const addProduct = createAsyncThunk('products/addProduct', async (formData) => {
  const token = getAuthToken();
  
  try {
    const response = await api.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding product:', error.response ? error.response.data : error.message);
    throw error;
  }
});


export const updateProduct = createAsyncThunk('products/updateProduct', async ({ id, formData }) => {
    const token = getAuthToken();
  
    try {
      const response = await api.put(`/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error.response ? error.response.data : error.message);
      throw error;
    }
  });
  


export const deleteProduct = createAsyncThunk('products/deleteProduct', async (id) => {
  const token = getAuthToken();
  
  try {
    await api.delete(`/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return id;
  } catch (error) {
    console.error('Error deleting product:', error.response ? error.response.data : error.message);
    throw error;
  }
});

export const toggleFavorite = createAsyncThunk(
    'products/toggleFavorite',
    async ({ id, isFavorite }, { rejectWithValue }) => {
      try {
        const token = getAuthToken(); 
        const response = await api.put(
          `/products/${id}/favorite`, 
          { favorite: isFavorite }, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || 'Error toggling favorite status');
      }
    }
  );
  

const productSlice = createSlice({
  name: 'products',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        const product = action.payload;
        const existingIndex = state.items.findIndex(item => item._id === product._id);
        if (existingIndex >= 0) {
          state.items[existingIndex] = product;
        } else {
          state.items.push(product);
        }
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      })
    .addCase(toggleFavorite.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index].isFavorite = action.payload.isFavorite;
        }
      })
    
      .addCase(fetchProducts.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(toggleFavorite.rejected, (state, action) => {
        state.error = action.error.message;
      });

  },
});

export default productSlice.reducer;
