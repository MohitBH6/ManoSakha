import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Maximize, Minimize2, Maximize2 } from "lucide-react";
import API from "../services/geminiApi";

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [messages, setMessages] = useState([
    { type: "bot", text: "👋 Hi, I’m here to support you!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Default size
  const [customWidth, setCustomWidth] = useState(320);
  const [customHeight, setCustomHeight] = useState(384);

  // Default position bottom-right
  const [position, setPosition] = useState({ bottom: 20, right: 20, top: null, left: null });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDir, setResizeDir] = useState(null);

  const dragStart = useRef({ x: 0, y: 0, top: 0, left: 0 });
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0, top: 0, left: 0 });

  // Mobile detection
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Drag functions
  const onMouseDownDrag = (e) => {
    if (isFullScreen || isResizing) return;
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      top: position.top ?? 0,
      left: position.left ?? 0
    };
  };

  const onMouseDownResize = (e, dir) => {
    setIsResizing(true);
    setResizeDir(dir);
    resizeStart.current = {
      x: e.clientX,
      y: e.clientY,
      width: customWidth,
      height: customHeight,
      top: position.top ?? 0,
      left: position.left ?? 0
    };
    e.stopPropagation();
  };

  const onMouseMove = (e) => {
    // Drag
    if (isDragging) {
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      setPosition({
        top: dragStart.current.top + dy,
        left: dragStart.current.left + dx,
        bottom: null,
        right: null
      });
    }
    // Resize
    else if (isResizing) {
      const dx = e.clientX - resizeStart.current.x;
      const dy = e.clientY - resizeStart.current.y;
      let newWidth = resizeStart.current.width;
      let newHeight = resizeStart.current.height;
      let newTop = resizeStart.current.top;
      let newLeft = resizeStart.current.left;

      switch (resizeDir) {
        case "bottom-right":
          newWidth += dx;
          newHeight += dy;
          break;
        case "bottom-left":
          newWidth -= dx;
          newHeight += dy;
          newLeft += dx;
          break;
        case "top-right":
          newWidth += dx;
          newHeight -= dy;
          newTop += dy;
          break;
        case "top-left":
          newWidth -= dx;
          newHeight -= dy;
          newLeft += dx;
          newTop += dy;
          break;
        case "top":
          newHeight -= dy;
          newTop += dy;
          break;
        case "bottom":
          newHeight += dy;
          break;
        case "left":
          newWidth -= dx;
          newLeft += dx;
          break;
        case "right":
          newWidth += dx;
          break;
        default:
          break;
      }

      setCustomWidth(Math.max(200, newWidth));
      setCustomHeight(Math.max(200, newHeight));
      setPosition((prev) => ({ ...prev, top: newTop, left: newLeft }));
    }
  };

  const onMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeDir(null);
  };

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging, isResizing, resizeDir]);

  // Chat send
  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { type: "user", text: input }]);
    const userMessage = input;
    setInput("");
    setLoading(true);
    try {
      const res = await API.post("/chat", { message: userMessage });
      const botReply = res.data.reply || "Sorry, I couldn't answer that.";
      setMessages((prev) => [...prev, { type: "bot", text: botReply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "⚠️ Error: Could not reach API." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => { if (e.key === "Enter") handleSend(); };

  return (
    <div className="fixed z-50">
      {isOpen ? (
        <div
          className="bg-white shadow-xl flex flex-col rounded-2xl"
          // className={`bg-white shadow-xl flex flex-col rounded-2xl border-3 border-brown-200 backdrop-blur-sm`}
  
          onMouseDown={onMouseDownDrag}
          style={
            isFullScreen
              ? { top: 20, bottom: 20, left: 20, right: 20, position: "fixed" }
              : isMobile
              ? { bottom: 20, right: 20, width: customWidth, height: customHeight, position: "fixed" }
              : {
                  top: position.top,
                  left: position.left,
                  bottom: position.bottom,
                  right: position.right,
                  width: customWidth,
                  height: customHeight,
                  position: "fixed"
                }
          }
        >
          {/* Header */}
          <div className="bg-blue-600 text-white flex justify-between items-center px-4 py-2 rounded-t-2xl cursor-move">
            <h2 className="text-lg font-semibold">ManoSakha Bot</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsFullScreen(!isFullScreen)}
                className="hover:text-gray-300"
                title={isFullScreen ? "Minimize" : "Full Screen"}
              >
                {isFullScreen ? <Minimize2 size={20} /> : < Maximize2 size={20} />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto text-sm text-gray-700 space-y-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`${
                  msg.type === "user"
                    ? "bg-blue-100 text-blue-800 self-end"
                    : "bg-gray-100 text-gray-700 self-start"
                } p-2 rounded-lg max-w-[75%]`}
              >
                {msg.text}
              </div>
            ))}
            {loading && <p className="text-gray-400 text-xs">Bot is typing...</p>}
          </div>

          {/* Input */}
          <div className="border-t p-2 flex items-center">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 border rounded-lg px-3 py-1 text-sm focus:outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button
              className="ml-2 bg-blue-600 text-white px-3 py-1 rounded-lg text-sm"
              onClick={handleSend}
              disabled={loading}
            >
              Send
            </button>
          </div>

          {/* Resize handles */}
          {!isFullScreen && !isMobile && (
            <>
              {/* Corners */}
              <div onMouseDown={(e) => onMouseDownResize(e, "bottom-right")} className="w-4 h-4 bg-white-600 absolute bottom-0 right-0 cursor-se-resize rounded"></div>
              <div onMouseDown={(e) => onMouseDownResize(e, "bottom-left")} className="w-4 h-4 bg-white-600 absolute bottom-0 left-0 cursor-sw-resize rounded"></div>
              <div onMouseDown={(e) => onMouseDownResize(e, "top-right")} className="w-4 h-4 bg-blue-600 absolute top-0 right-0 cursor-ne-resize rounded"></div>
              <div onMouseDown={(e) => onMouseDownResize(e, "top-left")} className="w-4 h-4 bg-blue-600 absolute top-0 left-0 cursor-nw-resize rounded"></div>

              {/* Sides */}
              <div onMouseDown={(e) => onMouseDownResize(e, "top")} className="h-2 w-full absolute top-0 left-0 cursor-n-resize"></div>
              <div onMouseDown={(e) => onMouseDownResize(e, "bottom")} className="h-2 w-full absolute bottom-0 left-0 cursor-s-resize"></div>
              <div onMouseDown={(e) => onMouseDownResize(e, "left")} className="w-2 h-full absolute left-0 top-0 cursor-w-resize"></div>
              <div onMouseDown={(e) => onMouseDownResize(e, "right")} className="w-2 h-full absolute right-0 top-0 cursor-e-resize"></div>
            </>
          )}
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 fixed bottom-5 right-5"
        >
          <MessageCircle size={24} />
        </button>
      )}
    </div>
  );
}
