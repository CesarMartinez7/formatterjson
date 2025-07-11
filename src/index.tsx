import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { AppHomeLazy } from "./ui/LAZY_COMPONENT";
import "./App.css";

const root = document.getElementById("root")!;

ReactDOM.createRoot(root).render(
  <BrowserRouter>

    <Routes>
      <Route path="/" element={<AppHomeLazy />} />
    </Routes>
  </BrowserRouter>,
);
