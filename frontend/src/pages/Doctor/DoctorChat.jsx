import { useState } from "react";

const DoctorChat = () => {
  const patients = [
    { id: 1, name: "Rahul Sharma" },
    { id: 2, name: "Anita Verma" },
    { id: 3, name: "Amit Singh" },
  ];

  const [selectedPatient, setSelectedPatient] = useState(patients[0]);
  const [messageInput, setMessageInput] = useState("");

  const [messages, setMessages] = useState([
    { sender: "patient", text: "Hello doctor, I have fever." },
    { sender: "doctor", text: "Since when are you feeling this?" },
  ]);

  const sendMessage = () => {
    if (!messageInput.trim()) return;

    setMessages([
      ...messages,
      { sender: "doctor", text: messageInput },
    ]);

    setMessageInput("");
  };

  return (
    <div className="flex h-[80vh] bg-white rounded-xl shadow overflow-hidden">

      {/* ================= LEFT SIDE - PATIENT LIST ================= */}
      <div className="w-1/3 border-r bg-gray-50 p-4">
        <h2 className="text-lg font-semibold mb-4">Patients</h2>

        <div className="flex flex-col gap-2">
          {patients.map((patient) => (
            <div
              key={patient.id}
              onClick={() => setSelectedPatient(patient)}
              className={`p-3 rounded-lg cursor-pointer transition ${
                selectedPatient.id === patient.id
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              {patient.name}
            </div>
          ))}
        </div>
      </div>

      {/* ================= RIGHT SIDE - CHAT WINDOW ================= */}
      <div className="flex-1 flex flex-col">

        {/* Chat Header */}
        <div className="p-4 border-b bg-gray-100 font-semibold">
          Chat with {selectedPatient.name}
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-xs px-4 py-2 rounded-lg ${
                msg.sender === "doctor"
                  ? "bg-blue-600 text-white ml-auto"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t flex gap-2">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded-lg"
          />

          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700 transition"
          >
            Send
          </button>
        </div>

      </div>
    </div>
  );
};

export default DoctorChat;