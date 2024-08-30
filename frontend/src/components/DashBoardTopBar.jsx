import { useRecoilValue, useRecoilValueLoadable } from "recoil";
import { balanceAtom } from "../store/balance";
export function DashboardTopBar({ userFirstLetter }) {
  const balanceAndName = useRecoilValueLoadable(balanceAtom);
  if (balanceAndName.contents) {
    console.log(balanceAndName.contents);
  }
  return (
    <div className="flex justify-between border border-slate-300 border-x-0 border-t-0 mt-5">
      <div className="pl-8 mb-4 text-3xl font-bold">Payments App</div>
      <div className="flex justify-center pr-8 mb-5 ">
        <div className="mt-2">
          Hello,{" "}
          {balanceAndName.state === "hasValue" ? (
            balanceAndName.contents.firstName
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
            "error"
          )}
        </div>
        <div className=" bg-slate-400 h-10 w-10 flex ml-5 rounded-3xl justify-center items-center ">
          <div>
            {balanceAndName.state === "loading" ? (
              <div
                className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status"
              >
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                  Loading...
                </span>
              </div>
            ) : balanceAndName.state === "hasError" ? (
              "error"
            ) : (
              balanceAndName.contents.firstName.toUpperCase()[0]
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
