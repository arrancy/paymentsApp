import { atom, selector } from "recoil";
export const balanceAtom = atom({
  key: "balanceAtom",
  default: selector({
    key: "balanceAtomSelector",
    get: async () => {
      const jwt = localStorage.getItem("jwt");
      const response = await fetch(
        "http://localhost:4000/api/v1/account/balance",
        {
          headers: {
            "content-type": "application/json",
            authorization: "Bearer " + jwt,
          },
        }
      );
      const data = await response.json();
      return { balance: data.balance, firstName: data.firstName };
    },
  }),
});
