import { createContext, useContext, type RefObject } from "react";

export const WSContext = createContext<RefObject<WebSocket | null> | null>(null);
export const useWS = () => useContext(WSContext)!;