import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { CategoryType } from '../categories/categorySlice';

// Типы данных
export interface Transaction {
  _id: string;
  type: CategoryType;
  amount: number;
  description: string;
  date: string;
  categoryId: {
    _id: string;
    name: string;
    icon: string;
    color: string;
  };
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionFormData {
  type: CategoryType;
  amount: number;
  description: string;
  date?: string;
  categoryId: string;
}

interface TransactionState {
  transactions: Transaction[];
  transaction: Transaction | null;
  stats: {
    expenseStats: Array<{
      _id: string;
      total: number;
      count: number;
      name: string;
      icon: string;
      color: string;
    }>;
    incomeStats: Array<{
      _id: string;
      total: number;
      count: number;
      name: string;
      icon: string;
      color: string;
    }>;
    totalExpense: number;
    totalIncome: number;
    balance: number;
    dailyStats: Array<{
      _id: {
        date: string;
        type: CategoryType;
      };
      total: number;
    }>;
  };
  loading: boolean;
  error: string | null;
  page: number;
  pages: number;
  total: number;
}

// Начальное состояние
const initialState: TransactionState = {
  transactions: [],
  transaction: null,
  stats: {
    expenseStats: [],
    incomeStats: [],
    totalExpense: 0,
    totalIncome: 0,
    balance: 0,
    dailyStats: []
  },
  loading: false,
  error: null,
  page: 1,
  pages: 1,
  total: 0
};

// Асинхронные действия
export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async (params: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    type?: CategoryType;
    categoryId?: string;
  }, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      const userInfo = state.auth.userInfo;
      
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
        params
      };
      
      const { data } = await axios.get(
        'http://localhost:5000/api/transactions',
        config
      );
      
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const fetchTransactionById = createAsyncThunk(
  'transactions/fetchTransactionById',
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      const userInfo = state.auth.userInfo;
      
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      
      const { data } = await axios.get(
        `http://localhost:5000/api/transactions/${id}`,
        config
      );
      
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const createTransaction = createAsyncThunk(
  'transactions/createTransaction',
  async (transactionData: TransactionFormData, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      const userInfo = state.auth.userInfo;
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      
      const { data } = await axios.post(
        'http://localhost:5000/api/transactions',
        transactionData,
        config
      );
      
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const updateTransaction = createAsyncThunk(
  'transactions/updateTransaction',
  async ({ id, transactionData }: { id: string; transactionData: Partial<TransactionFormData> }, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      const userInfo = state.auth.userInfo;
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      
      const { data } = await axios.put(
        `http://localhost:5000/api/transactions/${id}`,
        transactionData,
        config
      );
      
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const deleteTransaction = createAsyncThunk(
  'transactions/deleteTransaction',
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      const userInfo = state.auth.userInfo;
      
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      
      await axios.delete(
        `http://localhost:5000/api/transactions/${id}`,
        config
      );
      
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const fetchTransactionStats = createAsyncThunk(
  'transactions/fetchTransactionStats',
  async (params: {
    startDate?: string;
    endDate?: string;
  }, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      const userInfo = state.auth.userInfo;
      
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
        params
      };
      
      const { data } = await axios.get(
        'http://localhost:5000/api/transactions/stats',
        config
      );
      
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Slice
const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    clearTransactionError: (state) => {
      state.error = null;
    },
    clearTransactionDetails: (state) => {
      state.transaction = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Обработка fetchTransactions
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload.transactions;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
        state.total = action.payload.total;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Обработка fetchTransactionById
      .addCase(fetchTransactionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactionById.fulfilled, (state, action: PayloadAction<Transaction>) => {
        state.loading = false;
        state.transaction = action.payload;
      })
      .addCase(fetchTransactionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Обработка createTransaction
      .addCase(createTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTransaction.fulfilled, (state, action: PayloadAction<Transaction>) => {
        state.loading = false;
        state.transactions = [action.payload, ...state.transactions];
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Обработка updateTransaction
      .addCase(updateTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTransaction.fulfilled, (state, action: PayloadAction<Transaction>) => {
        state.loading = false;
        state.transaction = action.payload;
        state.transactions = state.transactions.map(transaction => 
          transaction._id === action.payload._id ? action.payload : transaction
        );
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Обработка deleteTransaction
      .addCase(deleteTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTransaction.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.transactions = state.transactions.filter(transaction => transaction._id !== action.payload);
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Обработка fetchTransactionStats
      .addCase(fetchTransactionStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactionStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchTransactionStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearTransactionError, clearTransactionDetails } = transactionSlice.actions;
export default transactionSlice.reducer; 