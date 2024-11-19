
import NotePopup from "./NotePopup";



function TicketCard({ ticket }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      // weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className="w-auto animate-fade animate-once animate-ease-linear md:w-64 h-40 bg-white rounded-lg shadow-md border border-gray-200 mb-4 
    flex flex-col justify-between p-4 hover:shadow-lg hover:border-gray-400 mx-4 
    transform transition-all duration-300 ease-in-out hover:scale-105"
    >
      <div className="flex justify-between">
        <h2 className="text-lg font-bold text-indigo-500">
          Desk No: {ticket.deskNo}
        </h2>
        <span
          className={
            ticket.status === "Open"
              ? "bg-blue-500 text-white font-bold py-1 px-3 rounded-lg"
              : ticket.status === "Processing"
              ? "bg-yellow-500 text-white font-bold py-1 px-3 rounded-lg"
              : "bg-green-500 text-white font-bold py-1 px-3 rounded-lg"
          }
        >
          {ticket.status}
        </span>
      </div>
      <h3 className="text-md font-bold text-gray-600">{ticket.issue}</h3>
      <p className="text-gray-600 h-10 overflow-hidden text-ellipsis md:h-12">
        {ticket.description}
      </p>
      
      <div className="flex justify-between items-center mt-4">
        <p className="text-gray-600">{formatDate(ticket.dateTime)}</p>
        <p className="text-2xl text-red-400" >
         <NotePopup ticket={ticket}  />
      </p>
      </div>

    
    </div>
  );
}

export default TicketCard;
