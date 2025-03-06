import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Типы данных
export enum CategoryType {
  EXPENSE = 'expense',
  INCOME = 'income'
}

export interface Category {
  _id: string;
  name: string;
  type: CategoryType;
  icon: string;
  color: string;
  isDefault: boolean;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

interface CategoryFormData {
  name: string;
  type: CategoryType;
  icon?: string;
  color?: string;
}

// Начальное состояние
const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
};

// Асинхронные действия
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      const userInfo = state.auth.userInfo;
      
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      
      const { data } = await axios.get(
        'http://localhost:5000/api/categories',
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

export const fetchCategoriesByType = createAsyncThunk(
  'categories/fetchCategoriesByType',
  async (type: CategoryType, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      const userInfo = state.auth.userInfo;
      
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      
      const { data } = await axios.get(
        `http://localhost:5000/api/categories/type/${type}`,
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

export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (categoryData: CategoryFormData, { getState, rejectWithValue }) => {
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
        'http://localhost:5000/api/categories',
        categoryData,
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

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, categoryData }: { id: string; categoryData: Partial<CategoryFormData> }, { getState, rejectWithValue }) => {
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
        `http://localhost:5000/api/categories/${id}`,
        categoryData,
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

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
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
        `http://localhost:5000/api/categories/${id}`,
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

// Slice
const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearCategoryError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Обработка fetchCategories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Обработка fetchCategoriesByType
      .addCase(fetchCategoriesByType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoriesByType.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategoriesByType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Обработка createCategory
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action: PayloadAction<Category>) => {
        state.loading = false;
        state.categories = [...state.categories, action.payload];
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Обработка updateCategory
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action: PayloadAction<Category>) => {
        state.loading = false;
        state.categories = state.categories.map(category => 
          category._id === action.payload._id ? action.payload : category
        );
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Обработка deleteCategory
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.categories = state.categories.filter(category => category._id !== action.payload);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCategoryError } = categorySlice.actions;
export default categorySlice.reducer; 