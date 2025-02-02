import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../UserContext";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
}

interface Chat {
  conversation_id: string;
  name: string;
}

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState<Chat[]>([]);
  const { user } = useUser();

  // Fetch chat history when the user is set
  useEffect(() => {
    if (user) {
      fetchChatHistory();
    }
  }, [user]);

  // Fetch chat history from the API
  const fetchChatHistory = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/chats/", {
        params: { doctor_id: user?.id },
      });

      if (response.data && Array.isArray(response.data.conversations)) {
        console.log("Chat History:", response.data.conversations); // Debugging
        setChatHistory(response.data.conversations);
      } else {
        console.error("Unexpected response format:", response.data);
        setChatHistory([]);
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
      setChatHistory([]);
    }
  };

  // Load a specific chat by conversation_id
  const loadChat = async (conversationId: string) => {
    console.log("Loading chat with conversationId:", conversationId); // Debugging
    try {
      const response = await axios.get(`http://127.0.0.1:8000/chat/${conversationId}`);
      console.log("API Response:", response.data); // Debugging
  
      // Map the conversation array to the messages state
      const formattedMessages = response.data.conversation.map((msg: any) => ({
        id: msg.id,
        sender: msg.sender, // Ensure this matches the API response
        text: msg.text, // Ensure this matches the API response
      }));
  
      setConversationId(conversationId);
      setMessages(formattedMessages);
    } catch (error) {
      console.error("Error loading chat:", error);
    }
  };

  // Send a new message to the chatbot
  const sendMessage = async () => {
    if (!userInput.trim() || isTyping) return;

    const newMessage: Message = { id: Date.now().toString(), sender: "user", text: userInput };
    setMessages((prev) => [...prev, newMessage]);
    setIsTyping(true);

    try {
      let response;
      if (conversationId) {
        // Continue an existing conversation
        response = await axios.post("http://127.0.0.1:8000/chat/continue/", {
          conversation_id: conversationId,
          user_input: userInput,
        });
      } else {
        // Start a new conversation
        response = await axios.post("http://127.0.0.1:8000/chat/initiate/", {
          doctor_id: user?.id,
          user_input: userInput,
        });
        setConversationId(response.data.conversation_id);
      }

      // Format the bot's response for better readability
      const botReply = response.data.bot_reply;
      const formattedReply = formatBotReply(botReply);

      const botMessage: Message = { id: Date.now().toString(), sender: "bot", text: formattedReply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setIsTyping(false);
    setUserInput("");
  };

  // Helper function to format the bot's reply
  const formatBotReply = (reply: string) => {
    const lines = reply.split("\n");
    const formattedLines = lines.map((line, index) => {
      if (line.match(/^\d+\./)) {
        // If the line starts with a number, add proper spacing
        return `<div class="mb-2">${line}</div>`;
      }
      return line;
    });

    return formattedLines.join("");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for Chat History */}
      <div className="w-1/4 bg-white p-4 border-r overflow-y-auto">
        <h2 className="text-xl font-bold mb-2">Previous Chats</h2>
        {chatHistory.length > 0 ? (
          chatHistory.map((chat) => (
            <button
              key={chat.conversation_id}
              onClick={() => {
                console.log("Clicked chat:", chat.conversation_id); // Debugging
                loadChat(chat.conversation_id);
              }}
              className="block w-full p-2 text-left bg-gray-200 rounded-md mb-2 hover:bg-gray-300"
            >
              {chat.name}
            </button>
          ))
        ) : (
          <p className="text-gray-500">No previous chats</p>
        )}
      </div>

      {/* Chatbox */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-max px-4 py-2 rounded-lg mb-2 ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-black"
                }`}
                dangerouslySetInnerHTML={{ __html: msg.text }} // Render HTML for formatted bot replies
              />
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-300 text-black px-4 py-2 rounded-lg max-w-max">
                Typing...
              </div>
            </div>
          )}
        </div>

        {/* Input Box */}
        <div className="flex items-center p-4 bg-white border-t">
          <input
            className="flex-1 p-2 border rounded-lg focus:outline-none"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type a message..."
            disabled={isTyping}
          />
          <button
            className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
            onClick={sendMessage}
            disabled={isTyping}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;