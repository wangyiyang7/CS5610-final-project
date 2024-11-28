import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "../components/AuthContext";
import "./navigation.css";

const Navigation = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated, accountId, logout } = useContext(AuthContext);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleSearch = () => {
    navigate(`/search?query=${query}`);
  };

  const handleLogInClick = (e) => {
    e.preventDefault();
    if (isAuthenticated) {
      navigate(`/profile/${accountId}`);
    } else {
      navigate(`/login`);
    }
  };

  return (
    <div id="header-container">
      <div id="logo-container">
        <Link to="/">
          <img id="logo-icon" src="/images/store-logo.jpg" alt="store-logo" />
        </Link>
      </div>
      <div id="search-container">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div
        id="cart-container"
        onMouseEnter={() => setIsDropdownVisible(true)}
        onMouseLeave={() => setIsDropdownVisible(false)}
      >
        <Link to="/cart">
          <img id="cart-icon" src="/images/shopping-cart.png" alt="cart" />
        </Link>
        <a href="/login" onClick={handleLogInClick}>
          <img id="signin-icon" src="/images/signin-icon.png" alt="login" />
        </a>
        <div>
          {isAuthenticated && isDropdownVisible && (
            <div className="dropdown-menu" onClick={logout}>
              Logout
            </div>
          )}
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default Navigation;
