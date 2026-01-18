import axios from "axios";

const axiosWithCredentials = axios.create({
  baseURL: "http://localhost:8080/api", // Set Base URL here
});

axiosWithCredentials.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken"); // or use your auth store getter
  if (token) {
    config.headers = config.headers ?? {};
    config.headers["Authorization"] = `Bearer ${token}`; // correct spelling: Bearer
  }
  return config;
});

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

// export const addContact = ({contact}: {contact: ContactBase}) => {
//   return axiosWithCredentials.post<ContactResponse>(
//     `/contacts/add-contact`,
//     contact
//   );
// };

// add contact
export const addContact = (formData: FormData) => {
  return axiosWithCredentials.post("/contacts/add-contact", formData);
};

// export const updateContact = ({contact, id}: {contact: ContactBase, id: string}) => {
//   return axiosWithCredentials.put<ContactResponse>(
//     `/contacts/update/${id}`,
//     contact
//   );
// };

// update contact

export const updateContact = ({ id, formData }: { id: string; formData: FormData }) => {
  return axiosWithCredentials.put(`/contacts/update/${id}`, formData);
};

export const muteContact = (id: string) => {
  return axiosWithCredentials.put(`contacts/update/toggle-mute/${id}`);
}

export const deleteContact = (id: string) => {
  return axiosWithCredentials.delete<string>(
    `/contacts/delete-my-contact/${id}`
  );
};

export const getAllContacts = () => {
  return axiosWithCredentials.get<ContactResponse[]>(
    `/contacts/get-all-contacts/my`
  );
};

export const getContact = (id: string) => {
  return axiosWithCredentials.get<ContactResponse>(
    `/contacts/get-my-contact/${id}`
  );
};

export const getUserProfile = () => {
  return axiosWithCredentials.get<UserProfile>(`/users/get-user`);
};

export const updateUserProfile = ({formData}: {formData: FormData}) => {
  return axiosWithCredentials.put<UserProfile>(`/users/update-user`, formData);
}