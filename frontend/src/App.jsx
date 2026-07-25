import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Upload from "./pages/Upload";
import Dashboard from "./pages/Dashboard";
import LeakDetail from "./pages/LeakDetail";
import AgentResult from "./pages/AgentResult";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Upload />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leak/:id" element={<LeakDetail />} />
        <Route path="/agent-result" element={<AgentResult />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;