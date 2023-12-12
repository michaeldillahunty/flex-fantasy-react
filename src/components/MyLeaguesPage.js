import React, { useState, useEffect } from "react";

import logoPlaceholder from '../images/logos/logo_notext_192x192.png';
import NavBar from "./NavBar";
import LeagueCard from "./LeagueCard";
import './styles/MyLeaguesPage.css'
import service from "../API/service";
import { Link, useParams } from "react-router-dom";
import NFL_Logo from '../images/NFL_logo.png'
import axios from "axios";
import AddLeagueForm from "./AddLeagueForm";
import FlexLogo from '../images/logos/logo_notext_192x192.png'


const MyLeaguesPage = (props) => {
    const [leagues, setLeagues] = useState([])
    const [showAddLeagueForm, setShowAddLeagueForm] = useState(false); 
    const params = useParams()

    useEffect(() => {
        axios.get(`http://localhost:8000/api/getAllLeaguesForUser`, {withCredentials: true})
            .then((response) => {
                setLeagues(response.data);
                //console.log(response);
            })
            .catch((error) => {
                console.error(error);
            })
    }, []);

    const test = () => {
        axios.get('http://localhost:8000/api/getAllTeamsForUser')
            .then((response) => {
                console.log('User: ' + response);
            })
            .catch((error) => {
                console.error(error);
            })
    };


    const createLeague = (newLeagueData) => {
        axios.post('http://localhost:8000/api/createFantasyLeague', newLeagueData)
            .then((response) => {
                setLeagues([...leagues, response.data]);
                setShowAddLeagueForm(false);
            })
            .catch((error) => {
                console.error('Error creating league:', error);
            });
    };


    
    const leaveLeague = (id, event) => {
        event.preventDefault();
        //axios.delete(`http://localhost:8000/api/deleteFantasyLeague/${id}`)
        axios.post(`http://localhost:8000/api/removeTeamFromLeague/${id}`, null, { withCredentials: true })
            .then((response) => {
                //setLeagues(response.data);
                const filteredLeagues = leagues.filter(league => league._id !== id);

                // Update the state with the filtered leagues
                setLeagues(filteredLeagues);
            })
            .catch((error) => {
                console.error('Error leaving league: ', error);
            });

    };
    


    return (
        <div className="myLeaguesPage"> 
            <div className="header">
                <div className="logo">
                    <img src={logoPlaceholder} alt="Logo" />
                    <h1 className="title">Flex Fantasy</h1>
                </div>
                <h1 className="myLeaguesHeader"> My Leagues </h1>
                <NavBar isLoggedIn={props.isLoggedIn}/>
                
            </div>
            {/* <button onClick={() => test()} >Test</button> */}
            <button className="add-league-button" onClick={() => setShowAddLeagueForm(!showAddLeagueForm)}>+ Create New League</button> 
            
            {showAddLeagueForm && <AddLeagueForm onCreateLeague={createLeague} />} 

            <ul>
                {leagues.map((league) => (
                    <Link key={league._id} to={`/league/${league._id}`} className="link">
                        <LeagueCard leagueIcon={FlexLogo} leagueName={league.leagueName} members={league.leagueMembers-1} onLeaveLeague={(event) => leaveLeague(league._id, event)}/>
                    </Link>
                ))}
            </ul>
        </div>
    );

}



export default MyLeaguesPage;