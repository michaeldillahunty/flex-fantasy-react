// NavBar.js
import "./styles/NavBar.css"
import React from 'react';
import { Link } from 'react-router-dom';
import service from "../API/service";

function NavBar(props) {
  console.log(props.isLoggedIn);
  if(props.isLoggedIn){
    return (
      <nav className="nav-bar">
        <ul className="nav-list">
          <li className="nav-item">
            <Link to="/">Home</Link>
          </li>
          <li className="nav-item">
              <Link to="/newTeam">Create Team</Link> {/* Add this line */}
            </li>
          <li className="nav-item">
            <Link to="/logout">Logout</Link>
          </li>
        </ul>
      </nav>

    );
}
else{
  return(
<nav className="nav-bar">
      <ul className="nav-list">

        <li className="nav-item">
          <Link to="/login">Login</Link>
        </li>
        <li className="nav-item">
            
        </li>

      </ul>
    </nav>
  );
}
}

export default NavBar;