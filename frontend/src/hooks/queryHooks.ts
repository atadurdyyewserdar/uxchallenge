// Tiny helpers wrapping react-query for fetching data
import { useQuery } from "@tanstack/react-query";
import { getAllContacts, getContact, getUserProfile } from "../lib/contactsApi";

export const useContacts = () => {
  return useQuery({
    queryKey: ["contacts"],
    queryFn: () => getAllContacts(),
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