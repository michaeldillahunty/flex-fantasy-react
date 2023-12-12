import './styles/index.css';
import logoPlaceholder from '../logo.png';
import NavBar from './NavBar';
import service from '../API/service';
import axios from 'axios';
import React, { useEffect, useState } from "react";

const NFLScoresPage = (props)  => {



    return (
        <div>
            <header className="header">
                <div className="logo">
                    <img src={logoPlaceholder} alt="Logo"/>
                    <h1 className="title"> Flex Fantasy </h1>
                </div>
                <NavBar/>
            </header>

            <div>
                
            </div>
        </div>
    )
}