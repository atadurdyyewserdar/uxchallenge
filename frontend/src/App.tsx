import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Route, Routes } from "react-router";
import Contacts from "./pages/Contacts";
import { RequireAuth } from "./route/RequireAuth";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contacts" element={<RequireAuth><Contacts /></RequireAuth>} />
      </Routes>
    </div>
  );
}

export default App;
