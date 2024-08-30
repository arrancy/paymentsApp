import { useNavigate, useSearchParams } from "react-router-dom";
import { Heading } from "../components/Heading";
import { InputField } from "../components/InputFields";
import { Button } from "../components/Button";
import { useEffect, useState } from "react";
export function SendMoney() {
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
    if (!data.existsAndValid) {
      return navigate("/signin");
    } else {
      return;
    }
  }

  const [params] = useSearchParams();
  const id = params.get("id");
  const firstName = params.get("firstName");
  const lastName = params.get("lastName");
  function checkParams() {
    if (params.size) {
      return true;
    } else {
      return navigate("/dashboard");
    }
  }
  useEffect(() => {
    checkParams();
  }, []);

  const [moneyInput, setMoneyInput] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [isNumber, setIsNumber] = useState(true);
  const [transactionMessage, setTransactionMessage] = useState("");

  useEffect(() => {
    if (transactionMessage === "Transfer successful") {
      setMoneyInput("");
    }
  }, [transactionMessage]);
  return (
    <div className="h-screen bg-gray-100 flex flex-col justify-center">
      <div className=" border border-gray-300 w-2/6 rounded-md bg-white shadow-lg px-12 pb-8 pt-4  mx-auto text-center">
        <Heading label={"send money : "}></Heading>
        <h1 className="text-3xl font-semibold pb-2 text-slate-400 text-left">
          {firstName + " " + lastName}
        </h1>
        <div className="text-2xl font-bold text-left mb-2">amount :</div>
        <InputField
          value={moneyInput}
          onChange={(event) => {
            setTransactionMessage("");
            if (
              event.target.value === "" ||
              !isNaN(parseInt(event.target.value))
            ) {
              setIsNumber(true);
              setMoneyInput(event.target.value);
            } else {
              setIsNumber(false);
            }
          }}
        ></InputField>
        {!isNumber && (
          <p className="text-red-400"> please enter a valid number </p>
        )}
        <Button
          label={"initiate transfer"}
          onClick={async () => {
            if (waiting) {
              return;
            }
            if (isNumber === false) {
              return;
            } else {
              setWaiting(true);
              const jwt = localStorage.getItem("jwt");
              const response = await fetch(
                "http://localhost:4000/api/v1/account/transfer",
                {
                  method: "POST",
                  headers: {
                    "content-type": "application/json",
                    "authorization": "Bearer " + jwt,
                  },
                  body: JSON.stringify({
                    to: id,
                    amount: parseInt(moneyInput),
                  }),
                }
              );
              const data = await response.json();
              setTransactionMessage(data.msg);
              setWaiting(false);
            }
          }}
        ></Button>
        {waiting ? (
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
        ) : (
          transactionMessage
        )}
        <Button
          label={"done"}
          onClick={() => {
            navigate("/dashboard");
          }}
        >
          done
        </Button>
      </div>
    </div>
  );
}
