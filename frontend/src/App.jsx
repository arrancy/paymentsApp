import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Signup } from "./pages/Signup";
import { Signin } from "./pages/Signin";
import { Dashboard } from "./pages/Dashboard";
import { ErrorDisplay } from "./pages/Error";
import { SendMoney } from "./pages/SendMoney";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup></Signup>}></Route>
          <Route path="/signin" element={<Signin></Signin>}></Route>
          <Route path="/dashboard" element={<Dashboard></Dashboard>}></Route>
          <Route path="/send" element={<SendMoney></SendMoney>}></Route>
          <Route
            path="/error/:errorInput"
            element={<ErrorDisplay></ErrorDisplay>}
          ></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
