import React, { useEffect, useState } from "react";
import './styles/MyLeaguesPage.css'
import service from "../API/service";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import PageHeader from "./PageHeader";
import TeamCard from "./TeamCard";


async function fetchTeamData(teamId) {
    try {
      const response = await axios.get(`http://localhost:8000/api/getFantasyTeamById/${teamId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching data for team ${teamId}: ${error}`);
      return null;
    }
  }  


export default function UserTeamsPage(props) {
    const params = useParams();
    const id = params.id 
    const [teams, setTeams] = useState([]);
    const [teamData, setTeamData] = useState({});


    useEffect(() => {
        axios.get('http://localhost:8000/api/getAllTeamsForUser',  { withCredentials: true })
            .then((response) => {
                setTeams(response.data);
            })
            .catch((error) => {
                console.error(error);
            })
    }, []);

    return (
        <div className="UserTeamsPage">
            <PageHeader title={"User Teams Page"} isLoggedIn={props.isLoggedIn}/>
            <h1>My Teams: </h1>
            <ul>
                {teams.map((team) => (
                <li key={team._id}>
                    <Link to={`/team/${team._id}`} >
                        <TeamCard teamName={team.teamName} teamId={team._id}/>
                    </Link>
                </li>
                ))}
            </ul>
        </div>
    )
}