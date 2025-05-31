/** @format */
"use client";
import { FC, ReactNode, createContext, useContext, useState } from "react";

type Props = {
  children: ReactNode;
};

type ContextProps = {
  welcome: string;
  setWelcome: React.Dispatch<React.SetStateAction<string>>;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
};

const WelcomeContext = createContext<ContextProps>({
  welcome: "SMA YPPK TARUNA DHARMA JAYAPURA",
  setWelcome: () => {},
  title: "Default Title",
  setTitle: () => {},
  description: "Default Description",
  setDescription: () => {},
});

const WelcomeContextProvider: FC<Props> = ({ children }) => {
  const [welcome, setWelcome] = useState<string>(
    "SMA YPPK TARUNA DHARMA JAYAPURA"
  );
  const [title, setTitle] = useState<string>("Default Title");
  const [description, setDescription] = useState<string>("Default Description");

  return (
    <WelcomeContext.Provider
      value={{
        welcome,
        setWelcome,
        title,
        setTitle,
        description,
        setDescription,
      }}
    >
      {children}
    </WelcomeContext.Provider>
  );
};

export default WelcomeContextProvider;

export const useWelcomeContext = () => useContext(WelcomeContext);
