// axios instance that automatically sends auth token and talks to our backend
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { API_BASE } from "./api";

const axiosWithCredentials = axios.create({
  baseURL: API_BASE,
});

// attach JWT to outgoing requests when available
axiosWithCredentials.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

async function refreshTokens() {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) throw new Error("no-refresh");
  const { data } = await axiosWithCredentials.post("/auth/refresh-token", { refreshToken });
  localStorage.setItem("accessToken", data.accessToken);
  if (data.refreshToken) localStorage.setItem("refreshToken", data.refreshToken);
  return data.accessToken;
}

axiosWithCredentials.interceptors.response.use(
  (r) => r,
  async (err) => {
    const original = err.config as any;
    if (err.response?.status !== 401 || original?._retry) return Promise.reject(err);
    original._retry = true;

    try {
      const newToken = await refreshTokens();
      original.headers = { ...(original.headers || {}), Authorization: `Bearer ${newToken}` };
      return axiosWithCredentials(original);
    } catch (e) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
      return Promise.reject(e);
    }
  }
);

export interface ContactBase {
  fullName: string;
  email: string;
  phoneNumber: string;
  pictureUrl: string | null;
}

export interface UserProfile {
  id: string;
  email: string;
  userName: string;
  fullName: string;
  roles: string[];
  avatarUrl: string | null;
  isLocked: boolean;
  isActive: boolean;
  createdAt: string;
  lastModified: string;
}

export interface ContactResponse extends ContactBase {
  id: string;
  ownerUserName: string;
  createdAt: string;
  lastModified: string;
  isMuted: boolean;
}

export const addContact = (formData: FormData) =>
  axiosWithCredentials.post("/contacts/add-contact", formData);

export const updateContact = ({ id, formData }: { id: string; formData: FormData }) =>
  axiosWithCredentials.put(`/contacts/update/${id}`, formData);

export const muteContact = (id: string) =>
  axiosWithCredentials.put(`/contacts/update/toggle-mute/${id}`);

export const deleteContact = (id: string) =>
  axiosWithCredentials.delete<string>(`/contacts/delete-my-contact/${id}`);

export const getAllContacts = (params?: { param?: string }) => {
  return axiosWithCredentials.get<ContactResponse[]>("/contacts/get-all-contacts/my", { params });
}
  

export const getContact = (id: string) =>
  axiosWithCredentials.get<ContactResponse>(`/contacts/get-my-contact/${id}`);

export const getUserProfile = () =>
  axiosWithCredentials.get<UserProfile>("/users/get-user");

export const updateUserProfile = ({ formData }: { formData: FormData }) =>
  axiosWithCredentials.put<UserProfile>("/users/update-user", formData);
