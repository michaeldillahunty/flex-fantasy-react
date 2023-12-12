
import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import '../components/styles/MatchupPage.css'
import TeamPageHelper from './TeamPageHelper';
import logoPlaceholder from '../logo.png';
import NavBar from "./NavBar";
import service from "../API/service";
import PlayerCard from './PlayerCard';
import MatchupTeamCard from './MatchupTeamCard';
import TeamPointsCard from './TeamPointsCard';
const MatchupPage = (props) => {
  // Team data for Team 1 and Team 2
   // Replace with team 1 player data
  
 
  const params = useParams();
  const id = params.id  // this is team ID
  const [leagueData, setLeagueData] = useState({});
  const [teams, setTeams] = useState([]);
  const [teamData, setTeamData] = useState({});
  const [schedule, setSchedule] = useState([]);
  const [matchup,setMatchup] = useState([]);
  
   
  
  useEffect(() => {
    axios.get(`http://localhost:8000/api/getFantasyLeagueById/${location.state.leagueID.id}`)
        .then((response) => {
          
            setLeagueData(response.data);
            setTeams(response.data.teams);
        })
        .catch((error) => {
            console.log(error);
        })
}, [id]);

  useEffect(() => {
    const fetchSchedule = async () => {
      if(teams.length > 0){
      try {
        const body = { "teams": teams };
        await axios.post(`http://localhost:8000/api/getLeagueSchedule`, body).then((resonse)=>{
            setSchedule(resonse.data);
        });
      } catch (error) {
        console.error(error);
      }
    }
    };

    fetchSchedule();
  }, [teams]);

  useEffect(() => {
    // Only proceed to fetch the matchup when the schedule is set and id is available
    if (schedule.length > 0 && id) {
      const fetchMatchup = async () => {
        try {
           await service.fetchCurrentMatchup(id, schedule).then((response)=>{
              setMatchup(response);
              
           });
          
         
        } catch (error) {
          console.error('Error fetching matchup:', error);
        }
      };
  
      fetchMatchup();
    }
  }, [id, schedule]);
const location = useLocation();
console.log('matchup: ',matchup);
  return (
    <div className="MatchupPage">
      <header className="header">
        <div className="logo">
          <img src={logoPlaceholder} alt="Logo" />
          <h1 className="title">Flex Fantasy</h1>
        </div>
        <NavBar isLoggedIn = {props.isLoggedIn}/>
      </header>
      <div className="matchup-row">
        {/* Display Matchup Row with Team Information */}
        <div className="team-info">
          {/* Replace with actual team names, records, and total points */}
          {matchup !== null ? <TeamPointsCard id={matchup[0]}/> : <p>Loading...</p>}
          {/* {<TeamPointsCard id={matchup[0]}/> } */}
          {<MatchupTeamCard id={matchup[0]}/>}
        </div>
        <div className="vs">VS</div>
        <div className="team-info">
          {/* Replace with actual team names, records, and total points */}
          {matchup !== null ? <TeamPointsCard id={matchup[1]}/> : <p>Loading...</p>}
          {/* {<TeamPointsCard id={matchup[1]}/> } */}
          {<MatchupTeamCard id={matchup[1]}/>}
        </div>
      </div>
      <div className="team-container">
     
      </div>
    </div>
  );
};

export default MatchupPage;