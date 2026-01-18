import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactFormValues } from "../schemas/zodSchemas";
import { TextField } from "./TextField";
import { PrimaryButton } from "./PrimaryButton";
import { SecondaryButton } from "./SecondaryButton";
import AvatarEditor from "react-avatar-editor";
import { useEffect, useRef, useState } from "react";
import { AvatarInput } from "./AvatarInput";
import { Modal } from "./Modal";

interface ContactModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void; // Parent expects ready-to-go FormData
  initialData?: any;
  isPending: boolean;
}

export const ContactModalForm = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isPending,
}: ContactModalFormProps) => {
  const editorRef = useRef<AvatarEditor | null>(null);

  // state of currently selected image
  const [image, setImage] = useState<File | string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  // set initial form values and image when modal opens
  useEffect(() => {
    if (isOpen) {
      setImage(initialData?.pictureUrl || null);

      // reset form values to initial data
      reset(
        initialData
          ? {
              fullName: initialData.fullName,
              phoneNumber: initialData.phoneNumber,
              email: initialData.email,
            }
          : { fullName: "", phoneNumber: "", email: "" }
      );
    }
  }, [isOpen, initialData, reset]);

  const onFormSubmit = (data: ContactFormValues) => {
    const formData = new FormData();

    if (data.fullName !== initialData?.fullName) {
      formData.append("fullName", data.fullName);
    }
    if (data.email && data.email !== initialData?.email) {
      formData.append("email", data.email);
    }
    if (data.phoneNumber !== initialData?.phoneNumber) {
      formData.append("phoneNumber", data.phoneNumber);
    }

    // crop picture and append to formData
    if (editorRef.current && image && typeof image !== "string") {
      const canvas = editorRef.current.getImageScaledToCanvas();
      canvas.toBlob((blob) => {
        if (blob) {
          formData.append("profilePicture", blob, editorRef.current?.props.image.name);
          onSubmit(formData);
        }
      }, "image/png");
    }

    // check if image is null and initialData has pictureUrl
    else if (image === null && initialData?.pictureUrl) {
      formData.append("deletePicture", "true");
      onSubmit(formData);
    }

    // if there is no changes
    else {
      onSubmit(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit contact" : "Add contact"}
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 sm:space-y-6">
        <AvatarInput
          image={image}
          onChange={(newFile) => setImage(newFile)}
          onRemove={() => setImage(null)}
          editorRef={editorRef}
        />
        <div className="space-y-4">
          <TextField
            label="Name"
            placeholder="Jonas Jones"
            className="w-full sm:max-w-79"
            {...register("fullName")}
            error={errors.fullName?.message}
          />
          <TextField
            label="Phone number"
            placeholder="+36 01 234 5678"
            className="w-full sm:max-w-79"
            {...register("phoneNumber")}
            error={errors.phoneNumber?.message}
          />
          <TextField
            label="Email"
            placeholder="example@gmail.com"
            className="w-full sm:max-w-79"
            {...register("email")}
            error={errors.email?.message}
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
