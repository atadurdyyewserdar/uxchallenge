import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import type { AppDispatch, RootState } from "../redux/store";
import { Button } from "../components/Button";
import UxLogoWhite from "../assets/svg/uxlogowhite.svg";
import { Link, useNavigate } from "react-router";

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const isAuth = useSelector((s: RootState) => s.auth.isAuth);
  const navigate = useNavigate();

  return (
    <div className="">
      {isAuth ? (
        <div className="min-h-screen flex px-5 sm:px-10 md:px-20 lg:px-50 flex-col justify-between py-10 sm:py-20">
          <div>
            <div className="my-6 sm:m-10">
              <h1 className="type-h1">Contact app</h1>
            </div>
            <div className="my-6 sm:m-10">
              <h3 className="type-h3 mb-5">Developer challenge</h3>
              <h3 className="">by Serdar Atadurdyyev</h3>
              <Link to="https://serdarr.dev" className="block mt-2 text-sm text-blue-600 underline" target="_blank" rel="noopener noreferrer">
                serdarr.dev
              </Link>
            </div>
            <div className="my-6 sm:m-10 flex flex-wrap gap-2">
              <Button
                onClick={() => {
                  window.history.pushState({}, "", "/contacts");
                  window.dispatchEvent(new PopStateEvent("popstate"));
                }}
              >
                Go to contacts
              </Button>
              <Button
                onClick={() => {
                  dispatch(logout());
                  window.history.pushState({}, "", "/login");
                  window.dispatchEvent(new PopStateEvent("popstate"));
                }}
              >
                Logout
              </Button>
            </div>
          </div>
          <div className="my-6 sm:m-10">
            <img src={UxLogoWhite} alt="UX Studio" className="h-8 w-auto" />
          </div>
        </div>
      ) : (
        <div className="min-h-screen flex px-5 sm:px-10 md:px-10 lg:px-50 flex-col justify-between py-10 sm:py-10">
          <div>
            <div className="my-6 sm:m-10">
              <h1 className="type-h1">Contact app</h1>
            </div>
            <div className="my-6 sm:m-10">
              <h3 className="type-h3 mb-5">Developer challenge</h3>
              <span>by Serdar Atadurdyyev</span>
              <Link to="https://serdarr.dev" className="block mt-2 text-sm text-blue-600 underline" target="_blank" rel="noopener noreferrer">
                serdarr.dev
              </Link>
            </div>
            <div className="my-6 sm:m-10 flex flex-wrap gap-2">
              <Button
                className=""
                variant="special"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
              <Button
                className=""
                variant="special"
                onClick={() => navigate("/register")}
              >
                Sign up
              </Button>
            </div>
          </div>
          <div className="sm:m-10">
            <img src={UxLogoWhite} alt="UX Studio" className="mb-10 w-auto" />
          </div>
        </div>
      )}
    </div>
  );
}