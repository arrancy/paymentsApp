import { useParams } from "react-router-dom";

export function ErrorDisplay() {
  const errorMessage = useParams();
  return (
    <div className="flex flex-col justify-center items-start h-full">
      <h3>{errorMessage}</h3>
    </div>
  );
}
