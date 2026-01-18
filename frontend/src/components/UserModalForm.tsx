import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  userSchema,
  type UserFormValues,
} from "../schemas/zodSchemas";
import { TextField } from "./TextField";
import { PrimaryButton } from "./PrimaryButton";
import { SecondaryButton } from "./SecondaryButton";
import { useEffect } from "react";
import { Modal } from "./Modal";

interface UserModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void; // Parent expects ready-to-go FormData
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
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  // set initial form values and image when modal opens
  useEffect(() => {
    if (isOpen) {
      // reset form values to initial data
      reset(
        initialData
          ? {
              fullName: initialData.fullName,
              email: initialData.email,
              password: ""
            }
          : { fullName: "", email: "", password: "" }
      );
    }
  }, [isOpen, initialData, reset]);

  const onFormSubmit = (data: UserFormValues) => {
    const formData = new FormData();

    if (data.fullName !== initialData?.fullName && data.fullName.trim() !== "") {
      formData.append("fullName", data.fullName);
    }
    if (data.email && data.email !== initialData?.email && data.email.trim() !== "") {
      formData.append("email", data.email);
    }
    if (data.password && data.password.trim() !== "") {
      formData.append("password", data.password);
    }
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Profile Settings"
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 sm:space-y-6">
        <div className="space-y-4">
          <TextField
            label="Name"
            placeholder="Jonas Jones"
            className="w-full"
            {...register("fullName")}
            error={errors.fullName?.message}
          />
          <TextField
            label="Email"
            placeholder="example@gmail.com"
            className="w-full"
            {...register("email")}
            error={errors.email?.message}
          />
          <TextField
            label="Username"
            placeholder={initialData.userName}
            className="w-full"
            disabled
          />
          <TextField
            label="Password"
            placeholder="Enter your password"
            className="w-full"
            type="password"
            {...register("password")}
            error={errors.password?.message}
          />
        </div>
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
