import React, { useState } from "react";

export default function HeritageChat() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Namaste! 🙏 I'm Heritage AI. Ask me about India's culture, food, festivals, heritage sites, or hidden gems!",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMessage = message.trim();

    setMessages((prev) => [
      ...prev,
      { role: "user", text: userMessage },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.reply,
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Sorry, I couldn't connect to Heritage AI right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {open && (
        <div
          style={{
            position: "fixed",
            right: "25px",
            bottom: "90px",
            width: "360px",
            height: "520px",
            background: "#111",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "20px",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 9999,
            boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
            color: "white",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "18px",
              background: "linear-gradient(135deg, #8b4513, #c8863b)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <strong>🌏 Heritage AI</strong>
              <div style={{ fontSize: "12px", opacity: 0.8 }}>
                Your guide to India's heritage
              </div>
            </div>

            <button
              onClick={() => setOpen(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "white",
                fontSize: "20px",
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              padding: "15px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  alignSelf:
                    msg.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                  padding: "10px 13px",
                  borderRadius: "14px",
                  background:
                    msg.role === "user" ? "#c8863b" : "#222",
                  fontSize: "14px",
                  lineHeight: "1.5",
                }}
              >
                {msg.text}
              </div>
            ))}

            {loading && (
              <div
                style={{
                  alignSelf: "flex-start",
                  padding: "10px 13px",
                  borderRadius: "14px",
                  background: "#222",
                  fontSize: "14px",
                }}
              >
                Heritage AI is thinking... 🤔
              </div>
            )}
          </div>

          {/* Input */}
          <div
            style={{
              padding: "12px",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              display: "flex",
              gap: "8px",
            }}
          >
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about India..."
              style={{
                flex: 1,
                padding: "11px",
                borderRadius: "10px",
                border: "1px solid #444",
                background: "#1b1b1b",
                color: "white",
                outline: "none",
              }}
            />

            <button
              onClick={sendMessage}
              disabled={loading}
              style={{
                border: "none",
                borderRadius: "10px",
                padding: "0 14px",
                background: "#c8863b",
                color: "white",
                cursor: "pointer",
                fontSize: "18px",
              }}
            >
              ↑
            </button>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          right: "25px",
          bottom: "25px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          border: "none",
          background: "linear-gradient(135deg, #8b4513, #c8863b)",
          color: "white",
          fontSize: "25px",
          cursor: "pointer",
          zIndex: 10000,
          boxShadow: "0 8px 30px rgba(0,0,0,0.35)",
        }}
      >
        💬
      </button>
    </>
  );
}