import { useState, useRef, useEffect } from "react";

const AIChatbot = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Welcome to HealthSphere 👋\n\nI can help you:\n• Book doctor appointments\n• Find healthcare camps\n• Register for blood donation\n• Get general health guidance\n\nHow can I assist you today?"
    }
  ]);
  const [loading, setLoading] = useState(false);

  const chatRef = useRef(null);

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages]);

  /* ================= SEND MESSAGE ================= */
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:5000/api/chatbot/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ message: input })
        }
      );

      const data = await res.json();
      const fullText = data.reply || "No response.";

      // Add empty assistant message first
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "" }
      ]);

      let index = 0;

      const typingInterval = setInterval(() => {
        index++;

        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content =
            fullText.slice(0, index);
          return newMessages;
        });

        if (index >= fullText.length) {
          clearInterval(typingInterval);
          setLoading(false);
        }
      }, 15); // typing speed

    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Something went wrong. Please try again."
        }
      ]);
      setLoading(false);
    }
  };

  return (
    <>
      {/* ================= FLOATING BUTTON ================= */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setOpen(!open)}
          className="relative w-16 h-16 bg-blue-900  cursor-pointer rounded-full shadow-xl flex items-center justify-center text-white text-2xl hover:scale-110 transition duration-300"
        >
          💬
          <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-30 animate-ping"></span>
        </button>
      </div>

      {/* ================= CHAT WINDOW ================= */}
      <div
        className={`fixed bottom-24 right-6 w-[420px] h-[600px] max-w-[95%] bg-white rounded-2xl shadow-2xl z-50 transform transition-all duration-500 ${
          open
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-10 scale-95 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="bg-blue-900 text-white p-4 rounded-t-2xl flex justify-between items-center">
          <h3 className="font-semibold">
            HealthSphere AI Assistant
          </h3>
          <button
            onClick={() => setOpen(false)}
            className="text-white text-lg cursor-pointer"
          >
            ✖
          </button>
        </div>

        {/* Messages */}
        <div
          ref={chatRef}
          className="h-[470px] overflow-y-auto p-4 space-y-4 bg-gray-50 scroll-smooth pb-6"
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-3 rounded-2xl max-w-[75%] text-sm leading-relaxed shadow whitespace-pre-line ${
                  msg.role === "user"
                    ? "bg-blue-900 text-white rounded-br-none"
                    : "bg-white text-gray-800 border rounded-bl-none"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {/* Typing Animation */}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white px-4 py-3 rounded-2xl shadow border rounded-bl-none">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t flex gap-2 bg-white">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about appointments, camps, blood donation..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) =>
              e.key === "Enter" && sendMessage()
            }
          />
          <button
            onClick={sendMessage}
            className="bg-blue-900 text-white cursor-pointer px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
};

export default AIChatbot;