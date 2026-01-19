import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { NavLink, useNavigate } from "react-router";
import { PrimaryButton } from "../components/PrimaryButton";
import { TextField } from "../components/TextField";
import { authSchema, type AuthFormValues } from "../schemas/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import { useForm } from "react-hook-form";
import { login, resetError } from "../redux/authSlice";
import UxLogoWhite from "../assets/svg/uxlogowhite.svg";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    values: { userName: "", password: "" },
  });

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { status, error } = useSelector((s: RootState) => s.auth);
  const { isAuth } = useSelector((s: RootState) => s.auth);

  async function handleSubmitLogin(data: AuthFormValues) {
    await dispatch(login({ ...data, navigate }));
    // navigate to home
    //   window.history.pushState({}, "", "/");
    //   window.dispatchEvent(new PopStateEvent("popstate"));
  }

  useEffect(() => {
    if (isAuth) {
      navigate("/");
    }
  }, [isAuth]);

  useEffect(() => {
    dispatch(resetError());
  }, [dispatch]);

  return (
    <div className="min-h-screen flex items-center flex-col justify-center px-4 py-10 sm:py-30">
      <div className="mr-5">
            <img src={UxLogoWhite} alt="UX Studio" className="mb-10 w-auto" />
          </div>
      <form onSubmit={handleSubmit(handleSubmitLogin)} className="p-4 w-full max-w-md">
        <div>
          <TextField
            label="Username"
            {...register("userName")}
            error={errors.userName?.message}
            type="text"
            className="w-full"
          />
        </div>
        <div className="mt-3">
          <TextField
            label="Password"
            {...register("password")}
            error={errors.password?.message}
            type="password"
            className="w-full"
          />
        </div>
        <div className="mt-5 text-white">
          <PrimaryButton className="mb-2 w-full sm:w-auto" type="submit">
            Sign in
          </PrimaryButton>
          <div className="mt-4">
            <div className="mt-2 text-sm text-red-600">
              {status === "loading" ? "Logging in..." : error}
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <NavLink to="/register" className="text-blue-500 underline text-sm">
              Don't have an account? Sign up
            </NavLink>
            <NavLink to="/" className="text-blue-500 underline text-sm">
              Home page
            </NavLink>
          </div>
        </div>
      </form>
    </div>
  );
}
