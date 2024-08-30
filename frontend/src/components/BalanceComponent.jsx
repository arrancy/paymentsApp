import { useRecoilValue, useRecoilValueLoadable } from "recoil";
import { balanceAtom } from "./../store/balance";

export function BalanceComponent() {
  const balanceAndName = useRecoilValueLoadable(balanceAtom);

  return (
    <div className="flex mt-3">
      <div className="font-bold ml-8"> balance </div>
      <div className="font-bold ml-4">
        {balanceAndName.state === "hasValue" ? (
          balanceAndName.contents.balance
        ) : balanceAndName.state === "loading" ? (
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
        ) : (
          "Error"
        )}
      </div>
    </div>
  );
}
