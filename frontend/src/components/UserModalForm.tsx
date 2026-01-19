import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema, type UserFormValues } from "../schemas/zodSchemas";
import { TextField } from "./TextField";
import { PrimaryButton } from "./PrimaryButton";
import { SecondaryButton } from "./SecondaryButton";
import { useEffect } from "react";
import { Modal } from "./Modal";

// interface for user profile settings modal
interface UserModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void;
  initialData?: any;
  isPending: boolean;
}

export const UserModalForm = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isPending,
}: UserModalFormProps) => {
  // Initialize form with validation schema
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
  });

  // Close modal and reset form
  const handleClose = () => {
    reset();
    onClose();
  };

  // Populate form fields with user's current data when modal opens
  useEffect(() => {
    if (isOpen) {
      // reset form values to initial data
      reset(
        initialData
          ? {
              fullName: initialData.fullName,
              email: initialData.email,
              password: "",
            }
          : { fullName: "", email: "", password: "" },
      );
    }
  }, [isOpen, initialData, reset]);

  // Handle form submission and prepare formdata for api request
  const onFormSubmit = (data: UserFormValues) => {
    const formData = new FormData();

    // Only include fields that have been changed and are not empty
    if (
      data.fullName !== initialData?.fullName &&
      data.fullName.trim() !== ""
    ) {
      formData.append("fullName", data.fullName);
    }
    if (
      data.email &&
      data.email !== initialData?.email &&
      data.email.trim() !== ""
    ) {
      formData.append("email", data.email);
    }
    if (data.password && data.password.trim() !== "") {
      formData.append("password", data.password);
    }
    onSubmit(formData);
  };

  // Don't render if modal is closed
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Profile Settings">
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="space-y-4 sm:space-y-6 w-full max-w-xl mx-auto"
      >
        <div className="space-y-5 w-full">
          {/* Name field */}
          <TextField
            label="Name"
            placeholder="Jonas Jones"
            className="w-full h-12 sm:h-14 text-base sm:text-lg"
            defaultValue={initialData?.fullName || ""}
            {...register("fullName")}
            error={errors.fullName?.message}
          />
          {/* Email field */}
          <TextField
            label="Email"
            placeholder="example@gmail.com"
            className="w-full h-12 sm:h-14 text-base sm:text-lg"
            defaultValue={initialData?.email || ""}
            {...register("email")}
            error={errors.email?.message}
          />
          {/* Username field (read-only) */}
          <TextField
            label="Username"
            placeholder={initialData?.userName || ""}
            className="w-full h-12 sm:h-14 text-base sm:text-lg"
            disabled
          />
          {/* Password field */}
          <TextField
            label="Password"
            placeholder="Enter your password"
            className="w-full h-12 sm:h-14 text-base sm:text-lg"
            type="password"
            {...register("password")}
            error={errors.password?.message}
          />
        </div>
        {/* Action buttons */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
          <SecondaryButton
            className="w-full sm:w-auto sm:flex-1 sm:min-w-20 sm:max-w-25"
            onClick={handleClose}
            type="button"
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton
            className="w-full sm:w-auto sm:flex-1 sm:min-w-20 sm:max-w-25"
            type="submit"
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Done"}
          </PrimaryButton>
        </div>
      </form>
    </Modal>
  );
};
