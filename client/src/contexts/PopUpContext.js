import { createContext, useState } from "react";

export const PopUpContext = createContext();

export function PopUpProvider({ children }) {
  const [PopUpChoosing, setPopUpChoosing] = useState(false);

  const toggleViewPage = (PopUpChoosing) => {
    setPopUpChoosing(PopUpChoosing);
  };
  const value = {
    PopUpChoosing,
    toggleViewPage,
  };
  return <PopUpContext.Provider value={value}>{children}</PopUpContext.Provider>;
}
