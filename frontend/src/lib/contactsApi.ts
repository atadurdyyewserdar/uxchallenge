// axios instance that automatically sends auth token and talks to our backend
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

const axiosWithCredentials = axios.create({
  baseURL: "/api",
});

// attach JWT to outgoing requests when available
axiosWithCredentials.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  retry?: boolean;
}

axiosWithCredentials.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    // If we get 401, try refreshing the access token once and replay the request
    if (error.response?.status === 401 && originalRequest && !originalRequest.retry) {
      originalRequest.retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token");
        
        const { data } = await axios.post(`/api/auth/refresh-token`, null, {
          params: { refreshToken },
        });
        
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return axiosWithCredentials(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
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

export const getAllContacts = () =>
  axiosWithCredentials.get<ContactResponse[]>("/contacts/get-all-contacts/my");

export const getContact = (id: string) =>
  axiosWithCredentials.get<ContactResponse>(`/contacts/get-my-contact/${id}`);

export const getUserProfile = () =>
  axiosWithCredentials.get<UserProfile>("/users/get-user");

export const updateUserProfile = ({ formData }: { formData: FormData }) =>
  axiosWithCredentials.put<UserProfile>("/users/update-user", formData);
