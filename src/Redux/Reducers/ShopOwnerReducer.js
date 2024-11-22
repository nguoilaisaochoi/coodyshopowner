import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import AxiosInstance from '../../helpers/AxiosInstance';

export const GetShop = createAsyncThunk('getshop', async id => {
  const response = await AxiosInstance().get(`shopOwner/${id}`);
  return response.data;
});

export const GetProduct = createAsyncThunk('getproducts', async id => {
  const response = await AxiosInstance().get(`products/shopOwner/${id}`);
  return response.data;
});

export const GetProductCategories = createAsyncThunk(
  'productCategories',
  async id => {
    const response = await AxiosInstance().get(
      `productCategories/shopOwner/${id}`,
    );
    return response.data;
  },
);

export const UpdateProduct = createAsyncThunk(
  'updateproducts',
  async ({id, data}) => {
    const response = await AxiosInstance().put(`products/update/${id}`, data);
    return response.data;
  },
);

export const AddProduct = createAsyncThunk('addproducts', async ({data}) => {
  const response = await AxiosInstance().post(`products/add`, data);
  return response.data;
});

export const GetRevenue = createAsyncThunk(
  'revenue',
  async ({id, data, date}) => {
    const response = await AxiosInstance().get(
      `shopOwner/${id}/revenue/?date=${data}&filter=${date}`,
    );
    return response.data;
  },
);

export const GetShopCategories = createAsyncThunk(
  'getshopcategories',
  async () => {
    const response = await AxiosInstance().get(`shopCategories/`);
    return response.data;
  },
);

export const ChangePassword = createAsyncThunk(
  'changePassword',
  async ({data}) => {
    const response = await AxiosInstance().post(
      `shopOwner/change-password`,
      data,
    );
    return response.data;
  },
);

export const UpdateShop = createAsyncThunk('updateshop', async ({id, data}) => {
  const response = await AxiosInstance().put(`shopOwner/update/${id}`, data);
  return response.data;
});

export const ShopSlice = createSlice({
  name: 'shopwner',
  initialState: {
    updateData: {},
    updateStatus: 'idle',
    getData: {},
    getStatus: 'idle',
    getRevenueData: {},
    getRevenueStatus: 'idle',
    getproductData: {},
    productStatus: 'idle',
    ProductCategoriesData: {},
    ProductCategoriesStatus: {},
    AddProductData: {},
    AddProductStatus: 'ide',
    GetShopCategoriesData: {},
    GetShopCategoriesStatus: 'ide',
    UpdateShopData: {},
    UpdateShopStatus: 'ide',
    ChangePasswordData: {},
    ChangePasswordStatus: 'ide',
  },
  reducers: {},
  extraReducers: builder => {
    builder
      //cập nhật shipper**
      .addCase(UpdateProduct.pending, (state, action) => {
        state.updateStatus = 'loading';
      })
      .addCase(UpdateProduct.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        state.updateData = action.payload;
      })
      .addCase(UpdateProduct.rejected, (state, action) => {
        state.updateStatus = 'failed';
        console.log(action.error.message);
      })
      //lấy thông tin shipper**
      .addCase(GetShop.pending, (state, action) => {
        state.getStatus = 'loading';
      })
      .addCase(GetShop.fulfilled, (state, action) => {
        state.getStatus = 'succeeded';
        state.getData = action.payload;
      })
      .addCase(GetShop.rejected, (state, action) => {
        state.getStatus = 'failed';
        console.error('K lấy đc shipper: ' + action.error.message);
      })
      //lấy doanh thu**
      .addCase(GetRevenue.pending, (state, action) => {
        state.getRevenueStatus = 'loading';
      })
      .addCase(GetRevenue.fulfilled, (state, action) => {
        state.getRevenueStatus = 'succeeded';
        state.getRevenueData = action.payload;
      })
      .addCase(GetRevenue.rejected, (state, action) => {
        state.getRevenueStatus = 'failed';
        console.error('K lấy đc doanh thu: ' + action.error.message);
      })
      //lấy sản phẩm
      .addCase(GetProduct.pending, (state, action) => {
        state.productStatus = 'loading';
      })
      .addCase(GetProduct.fulfilled, (state, action) => {
        state.productStatus = 'succeeded';
        state.getproductData = action.payload;
      })
      .addCase(GetProduct.rejected, (state, action) => {
        state.productStatus = 'failed';
        console.error('Lỗi lấy sp: ' + action.error.message);
      })
      //lấy loại sản phẩm
      .addCase(GetProductCategories.pending, (state, action) => {
        state.ProductCategoriesStatus = 'loading';
      })
      .addCase(GetProductCategories.fulfilled, (state, action) => {
        state.ProductCategoriesStatus = 'succeeded';
        state.ProductCategoriesData = action.payload;
      })
      .addCase(GetProductCategories.rejected, (state, action) => {
        state.ProductCategoriesStatus = 'failed';
        console.error('Lỗi lấy loai sp: ' + action.error.message);
      })
      //thêm sản phẩm
      .addCase(AddProduct.pending, (state, action) => {
        state.AddProductStatus = 'loading';
      })
      .addCase(AddProduct.fulfilled, (state, action) => {
        state.AddProductStatus = 'succeeded';
        state.AddProductData = action.payload;
      })
      .addCase(AddProduct.rejected, (state, action) => {
        state.AddProductStatus = 'failed';
        console.error('Lỗi them sp: ' + action.error.message);
      })
      //lấy loại bán hàng
      .addCase(GetShopCategories.pending, (state, action) => {
        state.GetShopCategoriesStatus = 'loading';
      })
      .addCase(GetShopCategories.fulfilled, (state, action) => {
        state.GetShopCategoriesStatus = 'succeeded';
        state.GetShopCategoriesData = action.payload;
      })
      .addCase(GetShopCategories.rejected, (state, action) => {
        state.GetShopCategoriesStatus = 'failed';
        console.error('Lỗi lấy loại bán hàng: ' + action.error.message);
      })
      //cập nhật shop
      .addCase(UpdateShop.pending, (state, action) => {
        state.UpdateShopStatus = 'loading';
      })
      .addCase(UpdateShop.fulfilled, (state, action) => {
        state.UpdateShopStatus = 'succeeded';
        state.UpdateShopData = action.payload;
      })
      .addCase(UpdateShop.rejected, (state, action) => {
        state.UpdateShopStatus = 'failed';
        console.error('Lỗi cập nhật: ' + action.error.message);
      })
      //thay đổi mk
      .addCase(ChangePassword.pending, (state, action) => {
        state.ChangePasswordStatus = 'loading';
      })
      .addCase(ChangePassword.fulfilled, (state, action) => {
        state.ChangePasswordStatus = 'succeeded';
        state.ChangePasswordData = action.payload;
      })
      .addCase(ChangePassword.rejected, (state, action) => {
        state.ChangePasswordStatus = 'failed';
        console.error('Lỗi doi mk: ' + action.error.message);
      });
  },
});
export default ShopSlice.reducer;
