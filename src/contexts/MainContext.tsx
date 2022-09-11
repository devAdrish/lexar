import React, { FC, ReactNode, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AiOutlineWarning } from "react-icons/ai";

interface MainContextProps {
  raiseToast: (args: RaiseToastFnArgs) => void;
}
interface MainContextProviderProps {
  children?: ReactNode;
}

export const MainContext = React.createContext<MainContextProps>({
  raiseToast: () => {},
});

const MainContextProvider: FC<MainContextProviderProps> = ({ children }) => {
  const [text, setText] = useState<string>("Done.");
  const [toastType, setType] = useState<string>("default");
  const [toast, setToast] = useState(false);

  const raiseToast = ({
    message = "Message",
    type = "default",
    duration = 1500,
  }: RaiseToastFnArgs) => {
    setText(message);
    setType(type);
    setToast(true);
    setTimeout(() => {
      setToast(false);
    }, duration);
  };

  return (
    <MainContext.Provider value={{ raiseToast }}>
      <AnimatePresence>
        {toast && (
          <motion.p
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1.02 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={() => {
              setToast(false);
            }}
            className="flex justify-center absolute left-0 right-0 top-0 z-50"
          >
            <span
              className={`mt-10 flex text-center truncate h-9 p-2 rounded-sm text-white text-xs
            ${
              toastType === "default"
                ? "bg-gray-100 text-black"
                : toastType === "error"
                ? "bg-red-600"
                : "bg-green-500"
            }`}
            >
              <AiOutlineWarning
                className="mr-3"
                style={{ color: "white", fontSize: "18px" }}
              />
              {text}
            </span>
          </motion.p>
        )}
      </AnimatePresence>
      {children}
    </MainContext.Provider>
  );
};

export default MainContextProvider;
