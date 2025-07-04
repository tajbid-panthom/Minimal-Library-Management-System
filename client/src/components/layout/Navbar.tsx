import { Link } from "react-router";

export default function Navbar() {
  const links = {
    "/": "All Books",
    "/add-books": "Add Books",
    "/borrow-summary": "Borrow Summary",
  };

  return (
    <nav className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
        {/* Logo */}
        <div className="text-3xl sm:text-4xl font-bold text-center sm:text-left">
          TajDEV<span className="text-amber-500">.</span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center sm:justify-end gap-4 mt-2 sm:mt-0">
          {Object.entries(links).map(([path, label]) => (
            <Link
              key={path}
              to={path}
              className="text-gray-600 text-base font-medium hover:text-blue-600 transition-colors duration-150"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
