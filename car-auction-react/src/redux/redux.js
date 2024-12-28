
import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
// import _ from 'lodash';


const initialState = {

    infoUser: { Info:{},walletAddress: "", loading: false, error: '', visiable: false },
    countNFTProduct: { count: 0, loading: false, error: '', visiable: false },
    allProducts: { products: [], loading: false, error: '', visiable: false },
    allhistorys: { historydata: [], loading: false, error: '', visiable: false },
    buyAuction:{addressOwner:"",addressCreateBy:"",status:0},
    AuctionStatus:{Seller:'',Buyer:'',auctionStatus:false,flagCurrent:0}
}


// arg: optional arguments (e.g., search query), thunkAPI: provides dispatch and getState
// const fetchProductsAsync = async () => {
//     try {
//         const response = await axios.get('http://localhost:3000/product');
//         return response.data;
//     } catch (error) {
//         return { error: error.message }; // Return an object with the error
//     }
// };
// chua lay luu vao recdux toan product
export const fetchProducts = createAsyncThunk(
    'auction/fetchProducts',
    async (_, thunkAPI) => {
        try {
            const response = await axios.get('http://localhost:3000/product');
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
            // Return an object with the error for better error handling
        }
    }
);

export const fetchHistorys = createAsyncThunk(
    'auction/fetchHistorys',
    async (_, thunkAPI) => {
        try {
            const response = await axios.get('http://localhost:3000/history');
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
            // Return an object with the error for better error handling
        }
    }
);


const Slice = createSlice({
    name: 'auction',
    initialState,
    reducers: {

        setInfoUser: (state, action) => {
            const { value } = action.payload;
            return {
                ...state, // Sao chép tất cả các properties hiện có của state
                infoUser: {
                    ...state.infoUser, // Sao chép tất cả các properties của infoUser
                    walletAddress: value, // Cập nhật walletAddress
                },
            };
        },
        upCountNFTProduct: (state, action) => {
            const { value } = action.payload;
            return {
                ...state, // Sao chép tất cả các properties hiện có của state
                countNFTProduct: {
                    ...state.countNFTProduct, // Sao chép tất cả các properties của infoUser
                    count: value + 1, // Cập nhật walletAddress
                },
            };
        },
        Logout: (state, action) => {
            const { target } = action.payload;
            return {
                ...state, // Sao chép tất cả các properties hiện có của state
                infoUser: {
                    ...state.infoUser, // Sao chép tất cả các properties của infoUser
                    walletAddress: "",
                     // Cập nhật walletAddress
                },
            };
        },
        Buy: (state, action) => {
            const { value } = action.payload;
            return {
                ...state, // Sao chép tất cả các properties hiện có của state
                buyAuction: {
                    ...state.buyAuction, // Sao chép tất cả các properties của infoUser
                    addressOwner:value.addressOwner,
                    status:value.status

                     // Cập nhật walletAddress
                },
            };
        },
        setInitBuy: (state, action) => {
            const { value } = action.payload;
            console.log(value.addressCreateBy);
            return {
                ...state, // Sao chép tất cả các properties hiện có của state
                buyAuction: {
                    ...state.buyAuction, // Sao chép tất cả các properties của infoUser
                    addressCreateBy:value.addressCreateBy,
                    addressOwner:value.addressOwner,
                    status:value.status

                     // Cập nhật walletAddress
                },
            };
        },

        setStatusAuction: (state, action) => {
            const { value } = action.payload;
            return {
                ...state, // Sao chép tất cả các properties hiện có của state
                AuctionStatus: {
                    ...state.AuctionStatus,
                    auctionStatus:!state.AuctionStatus.auctionStatus,
                    flagCurrent:state.AuctionStatus.flagCurrent === 0?1:0
                },
            };
        },
        setFlagCurrent: (state, action) => {
            const { value } = action.payload;
            return {
                ...state, // Sao chép tất cả các properties hiện có của state
                AuctionStatus: {
                    ...state.AuctionStatus,
                    flagCurrent:0
                },
            };
        },
        setSeller: (state, action) => {
            const { value } = action.payload;
            return {
                ...state, // Sao chép tất cả các properties hiện có của state
                AuctionStatus: {
                    ...state.AuctionStatus,
                    Seller:value.seller,
                    Buyer:value.buyer
                },
            };
        },
        



    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => ({
                ...state,
                allProducts: { ...state.allProducts, loading: true, error: null },
            }))
            .addCase(fetchProducts.fulfilled, (state, action) => ({
                ...state,
                allProducts: {
                    ...state.allProducts,
                    loading: false,
                    products: action.payload, // Correctly update products array
                    error: null,
                },
            }))
            .addCase(fetchProducts.rejected, (state, action) => ({
                ...state,
                allProducts: {
                    ...state.allProducts,
                    loading: false,
                    error: action.payload.error, // Access the error message
                },
            }))
            .addCase(fetchHistorys.pending, (state) => ({
                ...state,
                allhistorys: { ...state.allhistorys, loading: true, error: null },
            }))
            .addCase(fetchHistorys.fulfilled, (state, action) => ({
                ...state,
                allhistorys: {
                    ...state.allhistorys,
                    loading: false,
                    historydata: action.payload, // Correctly update products array
                    error: null,
                },
            }))
            .addCase(fetchHistorys.rejected, (state, action) => ({
                ...state,
                allhistorys: {
                    ...state.allhistorys,
                    loading: false,
                    error: action.payload.error, // Access the error message
                },
            }));
    },
    
    
})
export const { setSeller,setInfoUser, Logout, upCountNFTProduct, getAllProducts,Buy,setInitBuy,setStatusAuction,setFlagCurrent } = Slice.actions;

export default Slice.reducer;