import React, { useEffect, useState } from "react";
import './styles/MyLeaguesPage.css'
import './styles/LeaguePage.css'
import service from "../API/service";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import PageHeader from "./PageHeader";
import TeamCard from "./TeamCard";
import SendInvitesPage from "./SendInvitesPage";
import draftImg from '../images/draftboard_white.png';


async function fetchTeamData(teamId) {
    try {
      const response = await axios.get(`https://backend-mn36itr6dq-uc.a.run.app/api/getFantasyTeamById/${teamId}`);
      // console.log(JSON.stringify(response.data, null, 2))

      return response.data;
    } catch (error) {
      console.error(`Error fetching data for team ${teamId}: ${error}`);
      return null;
    }
  }  


export default function LeaguePage(props) {
    const params = useParams();
    const id = params.id 
    const [leagueData, setLeagueData] = useState({});
    const [teams, setTeams] = useState([]);
    const [teamData, setTeamData] = useState({});
    const [showSendInvites, setShowSendInvites] = useState(false);
    const [schedule, setSchedule] = useState([]);
    const [currentWeek, setCurrentWeek] = useState(0);

    // useEffect(() => {
    //   axios.get(`https://backend-mn36itr6dq-uc.a.run.app/api/getCurrentWeek`)
    //     .then((response) => {
    //       setCurrentWeek(response.data);
    //       console.log('Got current week');
    //     })
    //     .catch((error) => {
    //       error.log(error);
    //     })
    // });


    useEffect(() => {
        axios.get(`https://backend-mn36itr6dq-uc.a.run.app/api/getFantasyLeagueById/${id}`)
            .then((response) => {
                setLeagueData(response.data);
                setTeams(response.data.teams);
            })
            .catch((error) => {
                error.log(error);
            })
    }, [id]);

    useEffect(() => {
        const fetchTeamDataForTeams = async () => {
          const teamDataPromises = teams.map((teamId) => fetchTeamData(teamId));
          const teamDataArray = await Promise.all(teamDataPromises);
          const teamDataMap = {};
    
          teamDataArray.forEach((data, index) => {
            if (data) {
              teamDataMap[teams[index]] = data;
            }
          });
    
          setTeamData(teamDataMap);
        };
    
        fetchTeamDataForTeams();
      }, [teams]);


      useEffect(() => {
        const fetchData = async () => {
          try {
            // Fetch the current week first
            const weekResponse = await axios.get(`https://backend-mn36itr6dq-uc.a.run.app/api/getCurrentWeek`);
            setCurrentWeek(weekResponse.data);
            // console.log('Got current week');
      
            // Then fetch the schedule using the current week and teams
            const body = {
              "teams": teams
            };
      
            // console.log("schedule in body:", JSON.stringify(body, null, 2));
            const scheduleResponse = await axios.post(`https://backend-mn36itr6dq-uc.a.run.app/api/getLeagueSchedule`, body);
            setSchedule(scheduleResponse.data);
            // console.log('Got schedule');
          } catch (error) {
            console.error(error);
          }
        };
      
        // Fetch data only if teams are available
        if (teams) {
          fetchData();
        }
      }, [teams]);


    const sendInvite = (userId, leagueId) => {
      const body = {
        userId,
        leagueId
      }

      axios.post(`https://backend-mn36itr6dq-uc.a.run.app/api/createInvite`, body)
        .then((response) => {
          // console.log(response);
          setShowSendInvites(false);
        })
        .catch((error) => {
          console.error(error);
        })
    }
    


    return (
        <div className="LeaguePage">
            <div className="LeaguePage-title">
                <PageHeader title={leagueData.leagueName} isLoggedIn={props.isLoggedIn}/>
            </div>
            <div className="LeaguePage__header-content">
                <h1 className="league-name-header"> Welcome To {leagueData.leagueName}! </h1>
                <h4> Members: {leagueData.leagueMembers - 1} </h4>
                <button className="invite-button" onClick={() => setShowSendInvites(!showSendInvites)} > ✉️ Invite User </button>
                {showSendInvites && <SendInvitesPage onSendInvite={sendInvite} leagueId={id}/>} 
                <div className="draft-container">
                    <Link className="start-draft" to={`/draft/${id}`} state={{id}}>
                        <img src={draftImg}/>
                        <p> Start Draft </p>
                    </Link>
                </div>
            </div>
            
            <h2 className="teams-header">Teams:</h2>
            <ul>
                {teams.map((teamId, index) => (
                <li key={index} className="team-list-item">
                    {teamData[teamId] ? (
                   <Link className="team-page-link" to={`/team/${teamId}`} state={{ id }}>
                        <TeamCard teamName={teamData[teamId].teamName} teamId={teamId} teamOwner={teamData[teamId].ownerId}/>
                    </Link>
                    ) : (
                    `Data not available for team ${teamId}`
                    )}
                </li>
                ))}
            </ul>

            <div className="schedule-container">
              <h2 className="schedule-header">Schedule:</h2>
              <p className="current-week">Current Week: {currentWeek}</p>
              <ul className="schedule">
                {schedule.map((round, roundIndex) => (
                  <div
                    className={`schedule-round ${currentWeek === roundIndex + 1 ? 'highlighted-week' : ''}`}
                    key={roundIndex}
                  >
                    <h3>Week {roundIndex + 1}</h3>
                    <ul>
                      {round.map((match, matchIndex) => (
                        <li key={matchIndex}>
                          {match.map((teamId, teamIndex) => (
                            <span key={teamIndex}>
                              {teamData[teamId] ? (
                                <Link className="team-page-matchup" to={`/team/${teamId}`}>
                                  {teamData[teamId].teamName}
                                </Link>
                              ) : (
                                `Team ${teamId}`
                              )}
                              {teamIndex === 0 && " vs. "}
                            </span>
                          ))}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
            </ul>
          </div>
        </div>
    )
}