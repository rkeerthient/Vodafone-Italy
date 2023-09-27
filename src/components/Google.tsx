import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { ChatPanel } from "@yext/chat-ui-react";
import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";
import { useState, useEffect } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { useChatModeContext } from "../hooks";
import { cn } from "../lib/utils";
import Button from "./Button";
import { ChatModeContextProvider } from "./ChatModeContext";
import DirectAnswer from "./DirectAnswer";
import {
  useChatActions,
  useChatState,
  ChatHeadlessProvider,
} from "@yext/chat-headless-react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import SearchResults from "./SearchResults";

const Inner = () => {
  const shadowClasses = [
    "shadow-purple-600/25",
    "shadow-blue-600/25",
    "shadow-green-600/25",
    "shadow-yellow-600/25",
    "shadow-red-600/25",
  ];

  const chat = useChatActions();

  const [shadowClass, setShadowClass] = useState(shadowClasses[0]);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchComplete, setSearchComplete] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setShadowClass(
        shadowClasses[Math.floor(Math.random() * shadowClasses.length)]
      );
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSearchComplete(false);
      setHasSearched(true);
      e.preventDefault();
      e.stopPropagation();
      chat.restartConversation();
      chat
        .getNextMessage(e.currentTarget.value)
        .then(() => setSearchComplete(true));
    }
  };

  const isLoading = useChatState((s) => s.conversation.isLoading);

  const { chatMode, setChatMode } = useChatModeContext();

  return (
    <AnimatePresence>
      <div className="bg-white h-screen w-full flex flex-col relative">
        <div
          className={cn(
            "mx-auto my-auto flex flex-col gap-y-6 w-full transition-all duration-300 ease-out shrink-0",
            hasSearched ? "h-1/6 border-b border-gray-200 max-w-6xl" : "h-2/3"
          )}
        >
          <div
            className={cn(
              "my-auto w-full flex flex-row font-light rounded-full border border-gray-200 h-fit shadow-xl transition-all duration-[1500] ease-linear max-w-2xl",
              !hasSearched && shadowClass,
              hasSearched
                ? "text-base max-w-xl p-3"
                : "mx-auto text-lg max-w-2xl p-4"
            )}
          >
            <motion.input
              autoFocus
              onKeyDown={handleKeyDown}
              className="px-3 my-auto w-full h-full focus:outline-none"
            />
            {isLoading ? (
              <AiOutlineLoading3Quarters className="text-gray-700 ml-auto my-auto w-6 h-6 mr-2 animate-spin" />
            ) : (
              <MagnifyingGlassIcon className="text-gray-700 ml-auto my-auto w-6 h-6 mr-2" />
            )}
          </div>
        </div>
        <div
          className={cn(
            "mx-auto w-full transition-all flex flex-row h-full px-10 overflow-hidden"
          )}
        >
          {hasSearched && (
            <div className="h-full mx-auto w-full flex flex-col gap-y-5 gap-x-10 max-w-6xl overflow-auto">
              <DirectAnswer />
              <SearchResults />
            </div>
          )}
        </div>
      </div>
      {chatMode && (
        <motion.div
          key="chat-panel"
          initial={{ y: "100vh" }}
          animate={{ y: 0 }}
          exit={{ y: "100vh" }}
          transition={{ duration: 0.25 }}
          className="flex w-full h-full absolute top-0 left-0  bg-white"
        >
          <div className="mx-auto w-full h-full max-w-6xl shrink-0 relative">
            <Button
              className="z-50 absolute top-0 left-0 mt-4 mr-4"
              onClick={() => {
                setChatMode(false);
              }}
            >
              <BsArrowLeft className="inline-block w-4 h-4 mr-2 my-auto mx-auto" />
              Back to Search
            </Button>
            <ChatPanel
              customCssClasses={{
                container: "shadow-none my-0",
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function Google() {
  return (
    <ChatHeadlessProvider
      config={{
        apiKey: "1066fedb238935bc1d4724ad12c19d72",
        botId: "vodafone-italy",
        saveToSessionStorage: false,
      }}
    >
      <ChatModeContextProvider>
        <Inner />
      </ChatModeContextProvider>
    </ChatHeadlessProvider>
  );
}
