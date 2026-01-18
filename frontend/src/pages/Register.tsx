import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { TextField } from "../components/TextField";
import { PrimaryButton } from "../components/PrimaryButton";
import { NavLink } from "react-router";
import { registerSchema, type RegisterFormValues } from "../schemas/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import { useForm } from "react-hook-form";
import { registerUser, resetError } from "../redux/authSlice";
import { useEffect } from "react";

export default function Register() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    // values: { fullName: "", userName: "", password: "", email: "" },
  });
  const dispatch = useDispatch<AppDispatch>();
  const status = useSelector((s: RootState) => s.auth.status);
  const error = useSelector((s: RootState) => s.auth.error);

  async function handleSubmitSignup(data: RegisterFormValues) {
    await dispatch(registerUser({ ...data })).unwrap();
    // navigate to login
    window.history.pushState({}, "", "/login");
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  useEffect(() => {
    dispatch(resetError());
  }, [dispatch]);

  return (
    <div className="min-h-screen flex items-center flex-col justify-center px-4 py-10 sm:py-30">
      <form onSubmit={handleSubmit(handleSubmitSignup)} className="p-4 w-full max-w-md">
        <div>
          <TextField
            label="Username"
            className="w-full"
            placeholder="serdaratadu"
            {...register("userName")}
            error={errors.userName?.message}
          />
        </div>
        <div className="mt-3">
          <TextField
            label="Password"
            {...register("password")}
            error={errors.password?.message}
            className="w-full"
            placeholder="12345"
            type="password"
          />
        </div>
        <div className="mt-3">
          <TextField
            label="Email"
            className="w-full"
            placeholder="ux@gmail.com"
            {...register("email")}
            error={errors.email?.message}
          />
        </div>
        <div className="mt-3">
          <TextField
            label="Full name"
            {...register("fullName")}
            error={errors.fullName?.message}
            className="w-full"
            placeholder="Serdar Atadurdyyev"
          />
        </div>
        <div className="mt-5 text-white pb-5">
          <div>
            <PrimaryButton type="submit" className="mb-3 w-full sm:w-auto">
              Sign up
            </PrimaryButton>
          </div>
          <div className="mt-4">
            <div className="mt-2 text-sm text-red-600">
              {status === "loading" ? "Registering..." : error}
            </div>
          </div>
          <div className="mt-4">
            <NavLink to="/login" className="text-blue-500 underline text-sm">
              Already have an account? Sign in
            </NavLink>
          </div>
        </div>
      </form>
    </div>
  );
}
