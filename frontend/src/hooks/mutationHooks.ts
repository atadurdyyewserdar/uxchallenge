// Convenient mutation hooks (wrap mutation logic for components)
import { useMutation } from "@tanstack/react-query";
import { addContact, deleteContact, getUserProfile, muteContact, updateContact, updateUserProfile } from "../lib/contactsApi";

export const useDeleteContact = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: deleteContact,
    onSuccess: onSuccess
  });
};

export const useAddContact = (onSuccess?: () => void, onError?: (error: any) => void) => {
  return useMutation({
    mutationFn: addContact,
    onSuccess: onSuccess,
    onError: onError
  });
};

export const useUpdateContact = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: updateContact,
    onSuccess: onSuccess
  });
};

export const useMuteContact = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: muteContact,
    onSuccess: onSuccess
  });
};

// helper to fetch user profile via mutation (used in special flows)
export const useGetUserProfile = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: getUserProfile,
    onSuccess: onSuccess
  });
}

// update user profile (returns updated profile)
export const useUpdateUserProfile = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: onSuccess
  });
}