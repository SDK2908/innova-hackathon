import { Link } from "react-router-dom";
import "../styles/components.css";
function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <h2>🔍 Subscription Leak Detector</h2>
      </div>

      <div className="nav-links">
        <Link to="/">Upload</Link>
        <Link to="/dashboard">Dashboard</Link>
      </div>
    </nav>
  );
}
export default Navbar;