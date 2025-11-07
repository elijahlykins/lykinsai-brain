import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="flex justify-between items-center px-6 py-4 text-white">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold">LykinsAI</h1>
        <Link to="/saved" className="text-gray-300 hover:text-white">
          Saved
        </Link>
      </div>
      <Link to="/login" className="text-gray-300 hover:text-white">
        Login
      </Link>
    </header>
  );
}
export default Header;
