import React, { useState, createContext, ReactNode } from "react";

export type ChatModeContextType = {
  chatMode: boolean;
  setChatMode: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ChatModeContext = createContext<ChatModeContextType>({
  chatMode: false,
  setChatMode: () => {},
});

export const ChatModeContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [chatMode, setChatMode] = useState(false);

  return (
    <ChatModeContext.Provider value={{ chatMode, setChatMode }}>
      {children}
    </ChatModeContext.Provider>
  );
};
