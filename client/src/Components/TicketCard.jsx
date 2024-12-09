import NotePopup from "./NotePopup";
import { FaFileImage } from "react-icons/fa";

function TicketCard({ ticket }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateText = (text, length) => {
    return text.length > length ? text.slice(0, length) + "loading..." : text;
  };

  return (
    <div className="w-full md:w-72 h-80 bg-white bg-opacity-80 rounded-lg shadow-md border border-gray-200 mb-4 flex flex-col justify-between p-6 hover:shadow-lg hover:border-gray-400 mx-4 transform transition-all duration-300 ease-in-out hover:scale-105">
    <div className="flex justify-between">
      <h2 className="font-bold text-indigo-500">Desk No: {ticket.deskNo}</h2>
      <span className={
        ticket.status === "Open" ? "bg-blue-500 text-white font-bold py-1 px-4 rounded-lg" :
          ticket.status === "Processing" ? "bg-yellow-500 text-white font-bold py-1 px-4 rounded-lg" :
            "bg-green-500 text-white font-bold py-1 px-4 rounded-lg"
      }>
        {ticket.status}
      </span>
    </div>
    <div className="flex p-2 flex-col justify-between flex-grow">
      <div className="flex justify-between flex-row">
        <h3 className="text-lg font-bold text-gray-600">{ticket.issue}</h3>
        <span>
          {ticket.Image ? (
            <a target="_blank" href={ticket.Image}>
              <FaFileImage className="text-blue-500 text-2xl" />
            </a>
          ) : (" ")}
        </span>
      </div>
      <div className="text-gray-600 h-24 overflow-hidden text-ellipsis">
        {truncateText(ticket.description, 70)}
      </div>
    </div>
    <div className="flex justify-between items-center mt-4">
      <p className="text-gray-600">{formatDate(ticket.dateTime)}</p>
      <div className="text-2xl text-red-400">
        <NotePopup ticket={ticket} />
      </div>
    </div>
  </div>
  
  );
}

export default TicketCard;
