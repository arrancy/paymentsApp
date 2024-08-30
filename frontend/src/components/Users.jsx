import { InputField } from "./InputFields";
import { Button } from "./Button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export function UsersComponent() {
  const [users, setusers] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    getUsers("");
  }, []);
  async function getUsers(filter) {
    const jwt = localStorage.getItem("jwt");
    const response = await fetch(
      "http://localhost:4000/api/v1/user/bulk?filter=" + filter,
      {
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + jwt,
        },
      }
    );

    const data = await response.json();
    if (!response.ok) {
      navigate("/error:" + data.msg);
    }

    setusers(data.users);
  }

  return (
    <div className="pl-8 mt-4">
      <div className="font-bold text-2xl mb-4">Users</div>
      <InputField
        onChange={(event) => {
          getUsers(event.target.value);
        }}
        placeHolder={"search users"}
      ></InputField>
      {users.map((user) => {
        return <User user={user}></User>;
      })}
    </div>
  );
}

function User({ user }) {
  const navigate = useNavigate();
  return (
    <div className="flex justify-between mt-2">
      <div className="flex flex-col justify-center h-full ">
        <div>
          {user.firstName} {user.lastName}
        </div>
      </div>
      <div className="flex flex-col justify-center h-full">
        <Button
          label={"send money"}
          onClick={() => {
            navigate(
              "/send?id=" +
                user._id +
                "&" +
                "firstName=" +
                user.firstName +
                "&" +
                "lastName=" +
                user.lastName
            );
          }}
        ></Button>
      </div>
    </div>
  );
}
