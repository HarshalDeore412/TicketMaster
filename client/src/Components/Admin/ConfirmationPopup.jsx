import React, { useState } from "react";
import Modal from "react-modal";

// Ensure your app element is set for accessibility purposes
Modal.setAppElement("#root");

const ConfirmationPopup = ({ isOpen, onRequestClose, onConfirm }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
        content: {
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          maxWidth: "400px",
          padding: "20px",
          border: "none",
          borderRadius: "10px",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <div className="bg-white rounded-lg shadow-lg p-6 text-center">
        <h2 className="text-xl font-bold mb-4">Are you sure?</h2>
        <div className="flex justify-evenly mt-4">
          <button
            onClick={onConfirm}
            className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition duration-300"
          >
            Yes
          </button>
          <button
            onClick={onRequestClose}
            className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700 transition duration-300"
          >
            No
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationPopup;
