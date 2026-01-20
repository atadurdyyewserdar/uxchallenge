// Tiny helpers wrapping react-query for fetching data
import { useQuery } from "@tanstack/react-query";
import { getAllContacts, getContact, getUserProfile } from "../lib/api";

export const useContacts = (params?: { q?: string }) => {
  return useQuery({
    queryKey: ["contacts", params],
    queryFn: () => getAllContacts(params),
  });
};

export const useContact = (id: string) => {
  return useQuery({
    queryFn: () => getContact(id),
    queryKey: ["contact", id],
  });
};

// fetch the current logged-in user's profile
export const useUserProfile = () => {
  return useQuery({
    queryFn: () => getUserProfile(),
    queryKey: ["user"],
  });
}