import { Heading } from "../components/Heading";
import { SubHeading } from "../components/SubHeading";
import { InputField } from "../components/InputFields";
import { Button } from "../components/Button";
import { EndWarning } from "../components/EndWarning";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
export function Signup() {
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
  const [signupInput, setSignupInput] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  return (
    <>
      <div className="h-screen bg-gray-500 flex flex-col justify-center">
        <div className=" border border-black rounded-md bg-white shadow-lg	px-8 pb-8 pt-4 w-1/5 mx-auto text-center">
          <Heading label={"sign up"}></Heading>
          <SubHeading
            label={" enter your information to create an account"}
          ></SubHeading>
          <InputField
            label={"first name"}
            type={"text"}
            onChange={(event) => {
              let currentFirstName = event.target.value;
              setSignupInput({
                ...signupInput,
                firstName: currentFirstName,
              });
            }}
          ></InputField>
          <InputField
            label={"last name"}
            type={"text"}
            onChange={(event) => {
              let currentLastName = event.target.value;
              setSignupInput({
                ...signupInput,
                lastName: currentLastName,
              });
            }}
          ></InputField>

          <InputField
            label={"username"}
            type={"text"}
            onChange={(event) => {
              let currentUsername = event.target.value;
              setSignupInput({
                ...signupInput,
                username: currentUsername,
              });
            }}
          ></InputField>

          <InputField
            label={"password"}
            type={"password"}
            onChange={(event) => {
              let currentPassword = event.target.value;
              setSignupInput({
                ...signupInput,
                password: currentPassword,
              });
            }}
          ></InputField>

          <Button
            label={"sign up"}
            onClick={async () => {
              const response = await fetch(
                "http://localhost:4000/api/v1/user/signup",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(signupInput),
                }
              );
              const data = await response.json();
              if (!response.ok) {
                navigate("/error:" + data.msg);
              }
              localStorage.setItem("jwt", data.token);
              navigate("/dashboard");
              console.log("helloooo");
            }}
          ></Button>
          <EndWarning
            warning={"already have an acount? click here to "}
            option={"sign in"}
            redirect={() => {
              navigate("/signin");
            }}
          ></EndWarning>
        </div>
      </div>
    </>
  );
}
