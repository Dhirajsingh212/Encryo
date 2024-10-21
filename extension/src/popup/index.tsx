import { createRoot } from "react-dom/client";
import Popup from "./popup";
import "../styles/global.css";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<Popup />);
