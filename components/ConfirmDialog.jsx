import React from "react";

const ConfirmDialog = ({ isOpen, onClose, onConfirm, confirmMessage }) => {
  return isOpen ? (
    <div className="confirm-dialog">
      <div className="confirm-dialog-overlay">
        <div className="confirm-dialog-content ">
          <p className="mb-2 font-serif text-sm md:text-base">{confirmMessage}</p>
          <button onClick={onConfirm} className="mr-5 bg-green-500 hover:bg-green-600  text-white text-xs md:text-sm py-2 px-6 rounded-md">Yes</button>
          <button onClick={onClose} className="bg-red-500 hover:bg-red-600 text-white text-xs md:text-sm py-2 px-6 rounded-md">No</button>
        </div>
      </div>
    </div>
  ) : null;
};

export default ConfirmDialog;
