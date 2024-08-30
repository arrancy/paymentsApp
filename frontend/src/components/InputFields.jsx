export function InputField({ label, type, placeHolder, onChange, value }) {
  return (
    <div className="text-left font-semibold">
      <p>{label}</p>
      <input
        onChange={onChange}
        value={value}
        type={type}
        placeholder={placeHolder}
        className="  rounded-md w-full  border  border-gray"
        autoFocus
      ></input>
    </div>
  );
}
