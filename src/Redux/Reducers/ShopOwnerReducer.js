import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import AxiosInstance from '../../helpers/AxiosInstance';
import { ToastAndroid } from 'react-native';

//láy thông tin chửa hàng
export const GetShop = createAsyncThunk('getshop', async id => {
  const response = await AxiosInstance().get(`shopOwner/${id}`);
  return response.data;
});

//lấy toàn bộ món của shop
export const GetProduct = createAsyncThunk('getproducts', async id => {
  const response = await AxiosInstance().get(`products/shopOwner/normal/${id}`);
  return response.data;
});

//lấy toàn bộ nhóm món ăn của shop
export const GetProductCategories = createAsyncThunk(
  'productCategories',
  async id => {
    const response = await AxiosInstance().get(
      `productCategories/shopOwner/${id}?limit=15`,
    );
    return response.data;
  },
);

//cập nhật món
export const UpdateProduct = createAsyncThunk(
  'updateproducts',
  async ({id, data}) => {
    const response = await AxiosInstance().put(`products/update/${id}`, data);
    return response.data;
  },
);

//thêm món
export const AddProduct = createAsyncThunk('addproducts', async ({data}) => {
  const response = await AxiosInstance().post(`products/add`, data);
  return response.data;
});

//lấy doanh thu
export const GetRevenue = createAsyncThunk(
  'revenue',
  async ({id, data, date}) => {
    const response = await AxiosInstance().get(
      `shopOwner/${id}/revenue/?date=${data}&filter=${date}`,
    );
    return response.data;
  },
);

//lấy doanh thu tuỳ chỉnh
export const GetCustomRevenue = createAsyncThunk(
  'GetCustomRevenue',
  async ({id, startDate, endDate}) => {
    const response = await AxiosInstance().get(
      `shopOwner/${id}/revenue/custom-range?startDate=${startDate}&endDate=${endDate}`,
    );
    return response.data;
  },
);

//lấy toàn bộ loại shop
export const GetShopCategories = createAsyncThunk(
  'getshopcategories',
  async () => {
    const response = await AxiosInstance().get(`shopCategories/`);
    return response.data;
  },
);

//đổi mk
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

//cập nhật loại của hàng
export const UpdateShopCategory = createAsyncThunk(
  'UpdateShopCategory',
  async ({id, data}) => {
    const response = await AxiosInstance().put(
      `shopOwner/shopCategory/${id}`,
      data,
    );
    return response.data;
  },
);

//cập nhật shop
export const UpdateShop = createAsyncThunk('updateshop', async ({id, data}) => {
  const response = await AxiosInstance().put(`shopOwner/update/${id}`, data);
  return response.data;
});

//xoá món
export const DeleteProduct = createAsyncThunk('deleteProduct', async ({id}) => {
  const response = await AxiosInstance().delete(`products/softdelete/${id}`);
  return response.data;
});

//khôi phục món
export const RestoreProduct = createAsyncThunk(
  'restoreProduct',
  async ({id}) => {
    const response = await AxiosInstance().put(
      `products/restore/available/${id}`,
    );
    return response.data;
  },
);

//thêm nhóm
export const AddProductCate = createAsyncThunk(
  'addProductCate',
  async ({data}) => {
    const response = await AxiosInstance().post(`productCategories`, data);
    return response.data;
  },
);

//xoá nhóm món
export const DeleteProductCate = createAsyncThunk(
  'deleteproductcate',
  async id => {
    const response = await AxiosInstance().delete(
      `productCategories/softdelete/${id}`,
    );
    return response.data;
  },
);

//khôi phục nhóm món
export const RestoreProductCate = createAsyncThunk(
  'restoreRestoreProductCate',
  async ({id}) => {
    const response = await AxiosInstance().put(
      `productCategories/restore/available/${id}`,
    );
    return response.data;
  },
);
//cập nhật loại của hàng
export const UpdateProductCate = createAsyncThunk(
  'updateproductcate',
  async ({id, data}) => {
    const response = await AxiosInstance().put(`productCategories/${id}`, data);
    return response.data;
  },
);

//Mở cửa
export const GetOnlince = createAsyncThunk('GetOnlince', async id => {
  const response = await AxiosInstance().put(`shopOwner/open/${id}`);
  return response.data;
});

//Đóng cửa
export const GetOfflince = createAsyncThunk('GetOfflince', async id => {
  const response = await AxiosInstance().put(`shopOwner/closed/${id}`);
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
    UpdateShopCategoryData: {},
    UpdateShopCategoryStatus: 'ide',
    DeleteProductData: {},
    DeleteProductStatus: 'ide',
    AddProductCateData: {},
    AddProductCateStatus: 'ide',
    DeleteProductCateData: {},
    DeleteProductCateStatus: 'ide',
    UpdateProductCateData: {},
    UpdateProductCateStatus: 'ide',
    RestoreProductStatus: 'ide',
    RestoreProductCateStatus: 'ide',
    GetCustomRevenueData: {},
    GetCustomRevenueStatus: 'ide',
    GetOnlinceStatus: 'ide',
    GetOfflinceStatus: 'ide',
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
        if (action.error.message == 'Request failed with status code 401') {
          ToastAndroid.show('Mật khẩu cũ không chính xác', ToastAndroid.SHORT);
        } else {
          ToastAndroid.show('Lỗi đổi mật khẩu', ToastAndroid.SHORT);
        }
      })
      //update categories
      .addCase(UpdateShopCategory.pending, (state, action) => {
        state.UpdateShopCategoryStatus = 'loading';
      })
      .addCase(UpdateShopCategory.fulfilled, (state, action) => {
        state.UpdateShopCategoryStatus = 'succeeded';
        state.UpdateShopCategoryData = action.payload;
      })
      .addCase(UpdateShopCategory.rejected, (state, action) => {
        state.UpdateShopCategoryStatus = 'failed';
        console.error('Lỗi update loai shop' + action.error.message);
      })
      //xoá sản phẩm
      .addCase(DeleteProduct.pending, (state, action) => {
        state.DeleteProductStatus = 'loading';
      })
      .addCase(DeleteProduct.fulfilled, (state, action) => {
        state.DeleteProductStatus = 'succeeded';
      })
      .addCase(DeleteProduct.rejected, (state, action) => {
        state.DeleteProductStatus = 'failed';
        console.error('Lỗi xoa' + action.error.message);
      })
      //them nhom mon
      .addCase(AddProductCate.pending, (state, action) => {
        state.AddProductCateStatus = 'loading';
      })
      .addCase(AddProductCate.fulfilled, (state, action) => {
        state.AddProductCateStatus = 'succeeded';
      })
      .addCase(AddProductCate.rejected, (state, action) => {
        state.AddProductCateStatus = 'failed';
        console.error('Lỗi them loai' + action.error.message);
      })
      //xoa nhom on
      .addCase(DeleteProductCate.pending, (state, action) => {
        state.DeleteProductCateStatus = 'loading';
      })
      .addCase(DeleteProductCate.fulfilled, (state, action) => {
        state.DeleteProductCateStatus = 'succeeded';
      })
      .addCase(DeleteProductCate.rejected, (state, action) => {
        state.DeleteProductCateStatus = 'failed';
        console.error('Lỗi xoa nhom mon an' + action.error.message);
      })
      //update nhom on
      .addCase(UpdateProductCate.pending, (state, action) => {
        state.UpdateProductCateStatus = 'loading';
      })
      .addCase(UpdateProductCate.fulfilled, (state, action) => {
        state.UpdateProductCateStatus = 'succeeded';
      })
      .addCase(UpdateProductCate.rejected, (state, action) => {
        state.UpdateProductCateStatus = 'failed';
        console.error('Lỗi cap nhat nhom' + action.error.message);
      })
      //khoi phuc mon
      .addCase(RestoreProduct.pending, (state, action) => {
        state.RestoreProductStatus = 'loading';
      })
      .addCase(RestoreProduct.fulfilled, (state, action) => {
        state.RestoreProductStatus = 'succeeded';
      })
      .addCase(RestoreProduct.rejected, (state, action) => {
        state.RestoreProductStatus = 'failed';
        console.error('Lỗi khoi phuc mon' + action.error.message);
      })
      //khoi phuc nhom mon
      .addCase(RestoreProductCate.pending, (state, action) => {
        state.RestoreProductCateStatus = 'loading';
      })
      .addCase(RestoreProductCate.fulfilled, (state, action) => {
        state.RestoreProductCateStatus = 'succeeded';
      })
      .addCase(RestoreProductCate.rejected, (state, action) => {
        state.RestoreProductCateStatus = 'failed';
        console.error('Lỗi khoi phuc nhom mon' + action.error.message);
      })
      //lay doanh thu tuy chinh
      .addCase(GetCustomRevenue.pending, (state, action) => {
        state.GetCustomRevenueStatus = 'loading';
      })
      .addCase(GetCustomRevenue.fulfilled, (state, action) => {
        state.GetCustomRevenueStatus = 'succeeded';
        state.GetCustomRevenueData = action.payload;
      })
      .addCase(GetCustomRevenue.rejected, (state, action) => {
        state.GetCustomRevenueStatus = 'failed';
        console.error('Lỗi lay doanh thu tuy chinh' + action.error.message);
      })
      //mở cửa
      .addCase(GetOnlince.pending, (state, action) => {
        state.GetOnlinceStatus = 'loading';
      })
      .addCase(GetOnlince.fulfilled, (state, action) => {
        state.GetOnlinceStatus = 'succeeded';
      })
      .addCase(GetOnlince.rejected, (state, action) => {
        state.GetOnlinceStatus = 'failed';
        console.error('Lỗi mo cua' + action.error.message);
      })
      //đóng cửa
      .addCase(GetOfflince.pending, (state, action) => {
        state.GetOfflinceStatus = 'loading';
      })
      .addCase(GetOfflince.fulfilled, (state, action) => {
        state.GetOfflinceStatus = 'succeeded';
      })
      .addCase(GetOfflince.rejected, (state, action) => {
        state.GetOfflinceStatus = 'failed';
        console.error('Lỗi dong cua' + action.error.message);
      });
  },
});
export default ShopSlice.reducer;
