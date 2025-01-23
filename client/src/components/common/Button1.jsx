const Button1 = ({ buttonType, buttonLabel, className, onClick, disabled }) => {
  return (
    <button
      className={`border rounded-md px-10 py-1 bg-gray-200 hover:bg-gray-300 w-full transition font-medium ${className}`}
      onClick={onClick}
      type={buttonType || `submit`}
      disabled={disabled}
    >
      {buttonLabel}
    </button>
  );
};

export default Button1;
