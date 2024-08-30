export function EndWarning({ warning, option, redirect }) {
  return (
    <div>
      {warning}
      <span
        className="underline"
        onClick={redirect}
        style={{ cursor: "pointer" }}
      >
        {option}
      </span>
    </div>
  );
}
