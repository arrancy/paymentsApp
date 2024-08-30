import { InputField } from "../components/InputFields";
import { Heading } from "../components/Heading";
import { SubHeading } from "../components/SubHeading";
import { EndWarning } from "../components/EndWarning";
import { Button } from "../components/Button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export function Signin() {
  const navigate = useNavigate();
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
    if (data.existsAndValid) {
      return navigate("/dashboard");
    } else {
      return;
    }
  }
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  useEffect(() => {
    setPasswordInput("");
    setUsernameInput("");
  }, []);

  return (
    <div className="h-screen bg-gray-500 flex flex-col justify-center">
      <div className=" border border-black rounded-md bg-white shadow-lg	px-8 pb-8 pt-4 w-1/5 mx-auto text-center">
        <Heading label={"Signin"}></Heading>
        <SubHeading
          label={"enter your details to sign into your account"}
        ></SubHeading>
        <InputField
          label={"email"}
          type={"text"}
          onChange={(e) => {
            console.log(e.target.value);
            setUsernameInput(e.target.value);
          }}
        ></InputField>

        <InputField
          label={"password"}
          type={"password"}
          onChange={(e) => {
            setPasswordInput(e.target.value);
          }}
        ></InputField>
        <Button
          label={"sign in"}
          onClick={async () => {
            console.log(usernameInput);
            console.log(passwordInput);
            const response = await fetch(
              "http://localhost:4000/api/v1/user/signin",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  username: usernameInput,
                  password: passwordInput,
                }),
              }
            );
            const data = await response.json();
            if (!response.ok) {
              return navigate("/error:" + data.msg);
            }
            navigate("/dashboard");
            localStorage.setItem("jwt", data.token);
          }}
        ></Button>
        <EndWarning
          warning={"dont have an account? click here to "}
          option={"sign up"}
          redirect={() => {
            navigate("/signup");
          }}
        ></EndWarning>
      </div>
    </div>
  );
}
