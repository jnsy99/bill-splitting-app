const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50 p-2 sm:p-0">
      <div className="bg-gray-50 border border-primary p-5 rounded-md shadow-md space-y-2 w-full sm:w-5/12 container">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="w-5 h-5 bg-gray-200 rounded-full border hover:border-primary border-gray-200 flex items-center justify-center p-1 transition"
          >
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
