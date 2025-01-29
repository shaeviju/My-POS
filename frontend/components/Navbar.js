const Navbar = () => (
    <nav className="bg-gray-800 p-4">
      <ul className="flex space-x-4 text-white">
        <li>Dashboard</li>
        <li onClick={() => localStorage.removeItem('token')}>Logout</li>
      </ul>
    </nav>
  );
  
  export default Navbar;
  