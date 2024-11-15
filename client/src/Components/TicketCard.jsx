import React from 'react';

function TicketCard({ ticket }) {
    return (
        <div className="max-w-sm mx-auto h-fill bg-white rounded-lg shadow-md">
            <div className="p-4 bg-gray-100 ">
                {/* <h2 className="text-lg font-bold mb-2">{ticket.name}</h2> */}
                {/* <p className="text-gray-600 mb-2">{ticket.email}</p> */}
                {/* <p className="text-gray-600 mb-2">Process: {ticket.process}</p> */}
                <p className="text-gray-600 mb-2">Desk No: {ticket.deskNo}</p>
                <p className="text-gray-600 mb-2">Issue: {ticket.issue}</p>
                <p className="text-gray-600 mb-4">{ticket.description}</p>
                <div>

                    {/* <p className="text-gray-600 mb-2">Status: {ticket.status}</p> */}
                    <div className="w-[100%]">

                        <div className="text-gray-600 mb-2">
                           {new Date(ticket.dateTime).toLocaleString()}
                        </div>

                        <div>
                            {ticket.status === 'Open' ? (
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                                    Open
                                </button>
                            ) : ticket.status === 'Processing' ? (
                                <button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg">
                                    Processing
                                </button>
                            ) : (
                                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg">
                                    Closed
                                </button>
                            )}
                        </div>


                    </div>
                </div>


            </div>
        </div>
    );
}

export default TicketCard;
