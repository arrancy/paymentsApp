import { useEffect, useState } from "react";
import { BalanceComponent } from "../components/BalanceComponent";
import { DashboardTopBar } from "../components/DashBoardTopBar";
import { UsersComponent } from "../components/Users";
import { RecoilRoot } from "recoil";
import { useNavigate } from "react-router-dom";

export function Dashboard() {
  const navigate = useNavigate();
  const [tokenIsValid, setTokenIsValid] = useState(false);
  useEffect(() => {
    isTokenValid();
  }, []);

  async function isTokenValid() {
    const jwt = localStorage.getItem("jwt");
    const response = await fetch("http://localhost:4000/me", {
      headers: {
        "content-type": "application/json",
        "authorization": "Bearer " + jwt,
      },
    });
    const data = await response.json();
    if (!data.existsAndValid) {
      setTokenIsValid(false);
      console.log("abc");
      return navigate("/signin");
    } else {
      setTokenIsValid(true);
      return;
    }
  }
  return (
    <>
      {tokenIsValid && (
        <div>
          <RecoilRoot>
            <DashboardTopBar></DashboardTopBar>

            <BalanceComponent></BalanceComponent>
          </RecoilRoot>
          <UsersComponent></UsersComponent>
        </div>
      )}
    </>
  );
}
