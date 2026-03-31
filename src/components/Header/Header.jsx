import { Link } from "react-router-dom";
// import logo from "../../assets/logo.webp";

import "./Header.css";
const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-top">
          <div className="logo">
            <Link to="/">
              <h1>OH MY SKIN !</h1>
            </Link>
          </div>
          <input className="search-input" placeholder="Search" />
          <Link to="/formulaire">
            <button className="routine-btn">Crée ta routine skincare</button>
          </Link>
        </div>
      </div>
      <div className="container">
        <nav className="nav">
          <Link to="/cremes">Crèmes</Link>
          <Link to="/cleanser">Cleanser</Link>
          <Link to="/masques">Masques</Link>
          <Link to="/savons">Savons</Link>
          <Link to="/exfoliants">Exfoliants</Link>
          <Link to="/solaires">Crèmes solaires</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
