import './styles/index.css';
import logoPlaceholder from '../logo.png';
import NavBar from './NavBar';
import service from '../API/service';
import axios from 'axios';
import PlayerCard from './PlayerCard';
import { ParseJson } from './TeamPageHelper'
import { createPlayerProps } from './TeamPageHelper';
import React, { useEffect, useState } from "react";
import { Link, resolvePath, useParams } from "react-router-dom";
import './styles/TeamPage.css'
import './styles/MatchupCard.css'

const MatchupTeamCard = (props) => {
    const [teamPlayers, setTeamPlayers] = useState([]);
  const [teamProjectedPoints, setTeamProjectedPoints] = useState(0);
  
  const id = props.id;
  
  const [teamName, setTeamName] = useState("");
  

  var name = "My Team";
  useEffect(() => {
    if(id){
    axios.get(`https://backend-mn36itr6dq-uc.a.run.app/api/getFantasyTeamById/${id}`).then((response) => {
      console.log(response.data.players);
      setTeamPlayers([...response.data.players]);
      setTeamName([response.data.teamName]);
      
    });
  }
  }, [id]);
  useEffect(()=> {
    if(id){
    axios.get(`https://backend-mn36itr6dq-uc.a.run.app/api/getTeamProjectedPoints/${id}`)
    .then((response) => {
      setTeamProjectedPoints(response.data);
    })
    .catch((error) => {
      console.error(error);
    })
  }
  },[id]);

    return(
        <div className="MatchupTeamCard">
        <div className="teamName">
        
          {
            <h1 className="teamName">
              {teamName}
            </h1>
          }
          <h1 className='teamProjectedPoints'>
            Projected Points: {teamProjectedPoints.toFixed(2)}
          </h1>
        </div>
        {teamPlayers.map((player) => (
          <div key={player._id}> {/* Ensure each player has a unique key */}
            <PlayerCard {...player} />
            
          </div>
        ))}
      </div>
    );
  }
  export default MatchupTeamCard;
    
