import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";

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
  async function (
    { userName, password, navigate, setError },
    { rejectWithValue }
  ) {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/auth/login`,
        {
          userName: userName,
          password: password,
        },
        { withCredentials: true }
      );
      if (navigate) navigate("/");
      return response.data;
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error?.message || "Login failed";
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
  async function (
    { fullName, userName, password, email, navigate, setError },
    { rejectWithValue }
  ) {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/auth/register`,
        {
          fullName: fullName,
          userName: userName,
          password: password,
          email: email,
        }
      );
      if (navigate) navigate("/login");
      return response.data;
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error?.message || "Register failed";
      if (setError) setError(message);
      return rejectWithValue(message);
    }
  }
);

export const updateUser = createAsyncThunk<
  any,
  FormData,
  { rejectValue: string }
>(
  "auth/updateUser",
  async function (
    formData,
    { rejectWithValue }
  ) {
    try {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const response = await axios.post(
          `http://localhost:8080/api/users/update-user`, formData,{ headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
      }
      return;
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error?.message || "Update failed";
      return rejectWithValue(message);
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async function (_, { dispatch }) {
    localStorage.removeItem("persist:root");
    localStorage.removeItem("auth-storage");
    localStorage.removeItem("accessToken");
    dispatch(signOut());
  }
);

// initial state
const initialState: AuthState = {
  user: { userName: "" },
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
    builder.addCase(login.pending, (state) => {
      state.status = "loading";
      state.error = null;
      state.user = {};
      state.isAuth = false;
    });

    builder.addCase(login.fulfilled, (state, action: PayloadAction<any>) => {
      state.status = "resolved";
      state.user = action.payload;
      localStorage.setItem("accessToken", action.payload.accessToken);
      state.isAuth = true;
      state.error = null;
    });

    builder.addCase(login.rejected, (state, action) => {
      console.log("Login rejected:", action.payload);
      state.status = "rejected";
      state.error = (action.payload as string) || "Login failed";
      state.isAuth = false;
    });

    builder.addCase(registerUser.pending, (state) => {
      state.status = "loading";
      state.error = null;
      state.user = {};
      state.isAuth = false;
    });

    builder.addCase(registerUser.fulfilled, (state) => {
      state.status = "resolved";
      state.user = {};
      state.isAuth = false;
      state.error = null;
    });

    builder.addCase(registerUser.rejected, (state, action) => {
      state.status = "rejected";
      state.isAuth = false;
      state.error = (action.payload as string) || "Register failed";
      state.user = {};
    });
    builder.addCase(updateUser.pending, (state) => {
      state.status = "loading";
      state.error = null;
      state.user = {};
    });

    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.status = "resolved";
      state.user = action.payload;
      state.error = null;
    });

    builder.addCase(updateUser.rejected, (state, action) => {
      state.status = "rejected";
      state.error = (action.payload as string) || "Register failed";
      state.user = {};
    });
  },
});

export const { signOut, resetError } = authSlice.actions;
export default authSlice.reducer;
