import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import AxiosInstance from '../../helpers/AxiosInstance';

export const UpdateShipper = createAsyncThunk('update', async ({id, data}) => {
  const response = await AxiosInstance().put(`shipper/update/${id}`, data);
  return response.data;
});

export const GetShipper = createAsyncThunk('get', async id => {
  const response = await AxiosInstance().get(`shipper/${id}`);
  return response.data;
});

export const GetRevenue = createAsyncThunk('revenue', async ({id, data,date}) => {
  const response = await AxiosInstance().get(
    `shipper/${id}/revenue/?date=${data}&filter=${date}`,
  );
  return response.data;
});

export const ShipperSlice = createSlice({
  name: 'shipper',
  initialState: {
    updateData: {},
    updateStatus: 'idle',
    getData: {},
    getStatus: 'idle',
    getRevenueData: {},
    getRevenueStatus: 'idle',
    unActiveStatus: 'idle',
    ActiveStatus: 'idle',
  },
  reducers: {},
  extraReducers: builder => {
    builder
      //cập nhật shipper**
      .addCase(UpdateShipper.pending, (state, action) => {
        state.updateStatus = 'loading';
      })
      .addCase(UpdateShipper.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        state.updateData = action.payload;
      })
      .addCase(UpdateShipper.rejected, (state, action) => {
        state.updateStatus = 'failed';
        console.log(action.error.message);
      })
      //lấy thông tin shipper**
      .addCase(GetShipper.pending, (state, action) => {
        state.getStatus = 'loading';
      })
      .addCase(GetShipper.fulfilled, (state, action) => {
        state.getStatus = 'succeeded';
        state.getData = action.payload;
      })
      .addCase(GetShipper.rejected, (state, action) => {
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
      });
  },
});
export default ShipperSlice.reducer;
