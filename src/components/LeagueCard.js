import React, { useState } from "react";

import logoPlaceholder from '../logo.png';
import NavBar from "./NavBar";
import './styles/LeagueCard.css'
import service from "../API/service";
 

export default function LeagueCard({leagueIcon, leagueName, members, onLeaveLeague}) {
    return (
        <div className="LeagueCard"> 
            <img src={leagueIcon}></img>
            <h1 className="league-name"> {leagueName} </h1>
            <h1 className="members"> {members} Teams </h1>
            <button onClick={onLeaveLeague} className="leave-league-button"> Leave League ➡️ </button>
        </div>
    )
}
