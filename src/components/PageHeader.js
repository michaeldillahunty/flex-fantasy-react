import React from "react";
import './styles/PageHeader.css';
import logoPlaceholder from '../images/logos/logo_notext_192x192.png';
import NavBar from "./NavBar";


export default function PageHeader({title, isLoggedIn}) {
    return (
        <div className="pageHeader">
            <div className="logo">
                <a className="logo-home-link" href="/">
                    <img src={logoPlaceholder} alt="Logo" />
                    <h1 className="title">Flex Fantasy</h1>
                </a>
            </div>
            <h1 className="myLeaguesHeader"> {title} </h1>   
            <NavBar isLoggedIn = {isLoggedIn}/>
        </div>
    )
};