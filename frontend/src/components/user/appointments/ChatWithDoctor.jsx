import { useEffect, useRef, useState } from "react";

const ChatWithDoctor = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [message, setMessage] = useState("");

  const bottomRef = useRef(null);

  // Dummy doctors
  const doctors = [
    { id: 1, name: "Dr. Sharma", specialization: "Cardiologist", online: true },
    { id: 2, name: "Dr. Mehta", specialization: "Diabetologist", online: false },
    { id: 3, name: "Dr. Verma", specialization: "General Physician", online: true },
  ];

  // Messages stored per doctor
  const [conversations, setConversations] = useState({
    1: [
      {
        sender: "doctor",
        text: "Hello, how can I help you?",
        time: "10:00 AM",
      },
    ],
    2: [],
    3: [],
  });

  const currentMessages =
    selectedDoctor && conversations[selectedDoctor.id]
      ? conversations[selectedDoctor.id]
      : [];

  const sendMessage = () => {
    if (!message.trim() || !selectedDoctor) return;

    const newMessage = {
      sender: "me",
      text: message,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setConversations((prev) => ({
      ...prev,
      [selectedDoctor.id]: [
        ...prev[selectedDoctor.id],
        newMessage,
      ],
    }));

    setMessage("");

    // Fake doctor reply
    setTimeout(() => {
      const reply = {
        sender: "doctor",
        text: "Thank you for your message. Please describe your symptoms clearly.",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setConversations((prev) => ({
        ...prev,
        [selectedDoctor.id]: [
          ...prev[selectedDoctor.id],
          reply,
        ],
      }));
    }, 1200);
  };

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

  return (
    <div className="h-[75vh] bg-white rounded-2xl shadow flex overflow-hidden">

      {/* ================= SIDEBAR ================= */}
      <div className="w-1/3 border-r bg-gray-50 flex flex-col">

        <div className="p-4 font-semibold border-b bg-white">
          Doctors
        </div>

        <div className="flex-1 overflow-y-auto">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              onClick={() => setSelectedDoctor(doc)}
              className={`p-4 cursor-pointer border-b flex items-center gap-3 transition ${
                selectedDoctor?.id === doc.id
                  ? "bg-blue-50"
                  : "hover:bg-gray-100"
              }`}
            >
              {/* Avatar */}
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold">
                  {doc.name.charAt(3)}
                </div>

                {doc.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                )}
              </div>

              <div>
                <h4 className="font-medium">{doc.name}</h4>
                <p className="text-xs text-gray-500">
                  {doc.specialization}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= CHAT AREA ================= */}
      <div className="flex-1 flex flex-col">

        {!selectedDoctor ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-lg">
            Select a doctor to start chatting
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-4 border-b bg-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold">
                {selectedDoctor.name.charAt(3)}
              </div>

              <div>
                <h3 className="font-semibold">
                  {selectedDoctor.name}
                </h3>
                <p className="text-xs text-gray-500">
                  {selectedDoctor.online ? "Online" : "Offline"}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-6 overflow-y-auto bg-gray-100 space-y-4">
              {currentMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`max-w-sm px-4 py-2 rounded-2xl shadow-sm ${
                    msg.sender === "me"
                      ? "bg-blue-900 text-white ml-auto"
                      : "bg-white text-gray-800"
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className="text-xs opacity-70 block mt-1 text-right">
                    {msg.time}
                  </span>
                </div>
              ))}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t bg-white flex items-center gap-3">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-900"
              />

              <button
                onClick={sendMessage}
                className="bg-blue-900 text-white px-5 py-2 rounded-full hover:bg-blue-800 transition"
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatWithDoctor;