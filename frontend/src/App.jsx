import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Upload from "./pages/Upload";
import Dashboard from "./pages/Dashboard";
import LeakDetail from "./pages/LeakDetail";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Upload />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leak/:id" element={<LeakDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;