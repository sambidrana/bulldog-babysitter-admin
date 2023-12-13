import React from "react";

const ConfirmDialog = ({ isOpen, onClose, onConfirm, confirmMessage }) => {
  return isOpen ? (
    <div className="confirm-dialog">
      <div className="confirm-dialog-overlay">
        <div className="confirm-dialog-content">
          <p>{confirmMessage}</p>
          <button onClick={onConfirm} className="mr-5 bg-green-500 text-white py-2 px-6 rounded-md">Yes</button>
          <button onClick={onClose} className="bg-red-500 text-white py-2 px-6 rounded-md">No</button>
        </div>
      </div>
    </div>
  ) : null;
};

export default ConfirmDialog;
