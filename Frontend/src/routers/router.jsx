
import { Chatroom } from "../pages/ChatRoom";
import Choosepage from "../pages/ChoosePage";

import {
  createBrowserRouter,
} from "react-router-dom";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Choosepage/>,
  },
  {
    path: "/chatroom",
    element: <Chatroom/>
  }
]);