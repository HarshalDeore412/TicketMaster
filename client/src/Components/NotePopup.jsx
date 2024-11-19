import React, { useState } from "react";
import Modal from "react-modal";
import { FaRegNoteSticky } from "react-icons/fa6";

// Ensure your app element is set for accessibility purposes
Modal.setAppElement("#root");

const NotePopup = ({ ticket }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  return (
    <div>
      <p onClick={() => setModalIsOpen(true)} className="cursor-pointer">
        <FaRegNoteSticky />
      </p>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
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
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-bold mb-4">Note</h2>
          <p className="text-gray-700">{ticket.Note}</p>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setModalIsOpen(false)}
              className="bg-indigo-500 text-white font-bold py-2 px-4 rounded hover:bg-indigo-700 transition duration-300"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default NotePopup;
