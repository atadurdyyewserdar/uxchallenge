import { z } from "zod";

export const contactSchema = z.object({
  fullName: z.string().min(1, "Name is required").max(50, "Name is too long"),
  phoneNumber: z.string().regex(/^\+?[0-9. ()-]{7,25}$/, "Invalid phone number"),
  email: z.email("Invalid email address").or(z.literal("")),
});


export const authSchema = z.object({
    userName: z.string().min(4, "Username is required").max(50, "Username is too long"),
    password: z.string().min(4, "Password must be at least 4 characters long").max(100, "Password is too long"),
});

export const registerSchema = z.object({
  userName: z.string().min(4, "Username is required").max(50, "Username is too long"),
    fullName: z.string().min(1, "Full name is required").max(50, "Full name is too long"),
    password: z.string().min(4, "Password must be at least 4 characters long").max(100, "Password is too long"),
    email: z.email("Invalid email address").or(z.literal("")),
});

export const userSchema = z.object({
    fullName: z.string().min(1, "Full name is required").max(50, "Full name is too long"),
    email: z.email("Invalid email address").or(z.literal("")),
    password: z.string().min(4, "Password must be at least 4 characters long").max(50, "Password is too long").or(z.literal("")),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
export type AuthFormValues = z.infer<typeof authSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type UserFormValues = z.infer<typeof userSchema>;