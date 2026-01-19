import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";

// const API_BASE = "/api";
const API_BASE = "http://localhost:8080/api";

export interface User {
  userName?: string;
  [key: string]: any;
}

export interface AuthState {
  user: User | Record<string, never>;
  status: "loading" | "resolved" | "rejected" | null;
  error: string | null;
  isAuth: boolean;
}

type LoginArgs = {
  userName: string;
  password: string;
  navigate?: (to: string) => void;
  setError?: (msg: string) => void;
};

type RegisterArgs = {
  fullName?: string;
  userName: string;
  password: string;
  email?: string;
  navigate?: (to: string) => void;
  setError?: (msg: string) => void;
};

export const login = createAsyncThunk<any, LoginArgs, { rejectValue: string }>(
  "auth/login",
  async ({ userName, password, navigate, setError }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE}/auth/login`, {
        userName,
        password,
      });
      if (navigate) navigate("/");
      return response.data;
    } catch (error: any) {
      const message = error?.response?.data?.message || "Login failed";
      if (setError) setError(message);
      return rejectWithValue(message);
    }
  }
);

export const registerUser = createAsyncThunk<
  any,
  RegisterArgs,
  { rejectValue: string }
>(
  "auth/registerUser",
  async (
    { fullName, userName, password, email, navigate, setError },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`${API_BASE}/auth/register`, {
        fullName,
        userName,
        password,
        email,
      });
      if (navigate) navigate("/login");
      return response.data;
    } catch (error: any) {
      const message = error?.response?.data?.message || "Register failed";
      if (setError) setError(message);
      return rejectWithValue(message);
    }
  }
);

export const updateUser = createAsyncThunk<
  any,
  FormData,
  { rejectValue: string }
>("auth/updateUser", async (formData, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("No token");
    const response = await axios.post(
      `${API_BASE}/users/update-user`,
      formData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error: any) {
    const message = error?.response?.data?.message || "Update failed";
    return rejectWithValue(message);
  }
});

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    dispatch(signOut());
  }
);

const initialState: AuthState = {
  user: {},
  status: null,
  error: null,
  isAuth: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signOut(state) {
      state.status = null;
      state.error = null;
      state.user = {};
      state.isAuth = false;
    },
    resetError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(login.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action: PayloadAction<any>) => {
      state.status = "resolved";
      state.user = action.payload;
      state.isAuth = true;
      localStorage.setItem("accessToken", action.payload.accessToken);
      localStorage.setItem("refreshToken", action.payload.refreshToken);
    });
    builder.addCase(login.rejected, (state, action) => {
      state.status = "rejected";
      state.error = (action.payload as string) || "Login failed";
      state.isAuth = false;
    });

    // Register
    builder.addCase(registerUser.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state) => {
      state.status = "resolved";
      state.error = null;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.status = "rejected";
      state.error = (action.payload as string) || "Register failed";
    });

    // Update User
    builder.addCase(updateUser.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.status = "resolved";
      state.user = action.payload;
      state.error = null;
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      state.status = "rejected";
      state.error = (action.payload as string) || "Update failed";
    });
  },
});

export const { signOut, resetError } = authSlice.actions;
export default authSlice.reducer;
