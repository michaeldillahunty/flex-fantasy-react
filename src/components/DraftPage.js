import React, { useEffect, useState } from 'react';
import './styles/DraftPage.css';
import NavBar from './NavBar';
import logoPlaceholder from '../logo.png';
// import mainLogo from '../images/logos/logo_notext_192x192.png';
import mainLogo from '../images/logos/logo_notext_192x192.png';
import DraftTimer from './DraftTimer';
import service from '../API/service';
import PlayerCard from './PlayerCard';
import teamPageHelper from './TeamPageHelper';
import { createPlayerProps } from './TeamPageHelper';
import axios from 'axios';
import { useParams } from "react-router-dom";


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



function DraftPage(props) {
    const params = useParams();
    const numTeams = 8;
    const picksPerTeam = 15;
    const totalPicks = numTeams * picksPerTeam;
    const draftTime = 90;
    const leagueId = params.id;

    const [playerList, setPlayerList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    
    const [playerDetails, setPlayerDetails] = useState({});
    const [currentPick, setCurrentPick] = useState(1);
    const [currentPickIndex, setCurrentPickIndex] = useState(0);

    const [teams, setTeams] = useState([]); // Array of teams loaded from the endpoint
    const [draftBoard, setDraftBoard] = useState([]);
    const [teamData, setTeamData] = useState({});


    /// Resizable bottom panel
    const [bottomPanelHeight, setBottomPanelHeight] = useState('20vh');
    const [isDragging, setIsDragging] = useState(false);

    const startDrag = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };
      
    const doDrag = (e) => {
        if (isDragging) {
            // Calculate new height based on the cursor's Y position
            const newHeight = Math.min(window.innerHeight - e.clientY, window.innerHeight * 0.5); // Limit the height to 50vh
            setBottomPanelHeight(`${newHeight}px`);
        }
    };
      
    const stopDrag = () => {
        setIsDragging(false);
    };


    /// Player autocomplete search
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedEspnID, setSelectedEspnID] = useState(null);
    const handleSearch = async (event) => {
        const { value } = event.target; // get the player name from the input field
        setSearchTerm(value);
        if (value.length > 2) { // start searching after 2 or more characters
            try {
                const results = await service.searchPlayers(value); // function calls backend api
                setSearchResults(results);
            } catch (error) {
                console.error("Error searching for players: ", error);
            }
        } else {
            setSearchResults([]); // Clear results if the search term is too short
        }
    };

    /// Get the team name of the current pick
    const getCurrentTeamName = () => {
        const currTeamIndex = (currentPick - 1) % numTeams;
        const currTeamId = teams[currTeamIndex];
        return teamData[currTeamId] ? teamData[currTeamId].teamName : undefined;
    }


    useEffect(() => {
        const fetchTeamsAndInitializeDraftBoard = async () => {
            try {
               await axios.get(`https://backend-mn36itr6dq-uc.a.run.app/api/getTeamsInLeague/${leagueId}`)
                    .then((response) => {
                      setTeams(response.data);
                      const initialDraftBoard = initializeDraftBoard(response.data);
                      setDraftBoard(initialDraftBoard);
                      setIsLoading(false);
                    });
          
            } catch (error) {
                console.error("Error fetching teams: ", error);
            }
        };

      fetchTeamsAndInitializeDraftBoard();
    }, []); 


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

    const initializeDraftBoard = (teams) => {
        return Array.from({ length: totalPicks }, (_, pickIndex) => {
            const teamIndex = pickIndex % numTeams;
            // const teamName = teamData[teams[teamIndex]].teamName;
            const teamName = teamData[teams[teamIndex]] ? teamData[teams[teamIndex]].teamName : undefined;

            const isOddRound = pickIndex % (2 * numTeams) < numTeams;
            const backgroundColor = isOddRound ? '#34495e' : '#2ecc71';
            
            return {
                team: teamName,
                pickNumber: pickIndex + 1,
                backgroundColor,
                selectedPlayer: null,
            };
        }
    )};

    const [draftStarted, setDraftStarted] = useState(false);
    const [time, setTime] = useState(draftTime);
    const [draftOver, setDraftOver] = useState(false);
    

    const startTimer = () => {
        setDraftStarted(true);
    };


    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(remainingSeconds).padStart(2, '0');
        return `${formattedMinutes}:${formattedSeconds}`;
    };

    /// Draft Timer
    useEffect(() => {
        if (draftStarted && time > 0) {
            const timer = setInterval(() => {
                setTime(time - 1);
            }, 1000);
    
            return () => clearInterval(timer);
        } else if (time === 0) {
            // Time's up, move to the next pick
            if (currentPick < totalPicks) {
                setCurrentPick(currentPick + 1);
                setTime(draftTime); // Reset timer to initial time
            } else {
                setDraftStarted(false); // Draft is complete
                setDraftOver(true);
            }
        }
    }, [draftStarted, time, currentPick, totalPicks, draftTime]);

    /// Handle selected player in autocomplete search
    const handleSelectPlayer = (player) => {
        setSearchTerm('');
        setSearchResults([]);
        setSelectedEspnID(player.espnID); // This will save the espnID in the state
        fetchPlayerDetails(player.espnID);

        const currentTeamIndex = currentPickIndex % numTeams;
        const currentTeamId = teams[currentTeamIndex];

        const updatedDraftBoard = draftBoard.map((item, index) => {
            if (index === currentPickIndex) {
                return { ...item, selectedPlayer: player };
            }
            return item;
        });
    
        
        /// Update the draft board with the selected player 
        setDraftBoard(updatedDraftBoard); // Setter for draftBoard
        setCurrentPickIndex(currentPickIndex + 1); // Move to next pick
        setCurrentPick(currentPick + 1);
        setTime(draftTime);
        const body = {
          "teamId": currentTeamId,
          "player": player.espnName
        };

        axios.post(`https://backend-mn36itr6dq-uc.a.run.app/api/addPlayerToTeam`, body)
          .then((response) => {
            console.log(response.OK);
          })
          .catch((error) => {
            console.error(error);
          })
    };

    const searchPlayers = async (searchTerm) => {
        const response = await fetch(`/search-players?term=${encodeURIComponent(searchTerm)}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return await response.json();
    };

    useEffect(() => {
        // Request `/api/fantasyDraftList` endpoint
        async function fetchData() {  
            try {
                const response = await service.fetchFantasyDraftList();
                const availablePlayers = response.body
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        }
    fetchData();
    }, []);

    const fetchPlayerDetails = async(espnID) => {
        try {
            const response = await fetch(`/api/projectedNflPlayerStats/${espnID}`)
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }  
            const data = await response.json();
            setPlayerDetails(prevDetails => ({
                ...prevDetails,
                [espnID]: data.projectedPoints
            }));
            console.log("Projected Points: " + data);
        } catch (error) {
            console.error("Could not fetch player details using espnID: " + error);
        }
    }   


    useEffect(() => {
        if (isDragging) {
          window.addEventListener('mousemove', doDrag);
          window.addEventListener('mouseup', stopDrag);
        } else {
          window.removeEventListener('mousemove', doDrag);
          window.removeEventListener('mouseup', stopDrag);
        }
      
        return () => {
          window.removeEventListener('mousemove', doDrag);
          window.removeEventListener('mouseup', stopDrag);
        };
      }, [isDragging, doDrag]);

    return (
        <div className="DraftPage">
            <header className="header">
                <div className="logo">
                    <img src={mainLogo} alt="Logo" />
                    <h1 className="title">Flex Fantasy</h1>
                </div>
                <NavBar isLoggedIn={true} />
            </header>
            <div className="main-content">
                <div className="draft-board">
                      <div className="draft-timer draft-timer-btn">
                        <p className="timer">{formatTime(time)}</p>
                        <p className="current-pick-text">Current Pick: {getCurrentTeamName()}</p>
                        {!draftStarted && <button onClick={startTimer}> Start Draft </button>}
                        {draftOver ? <p>Draft Complete!</p> : <p></p>}
                      </div>
                
                    <div className="grid-container">
                        {draftBoard.map(pick => (
                            <div
                                key={pick.pickNumber}
                                className="pick"
                                style={{ backgroundColor: pick.backgroundColor, height: '70px' }}
                            >
                            <div className="pick-value">{pick.team}.{pick.pickNumber}</div>
                            {pick.selectedPlayer && (
                                <div className="selected-player">
                                    <img 
                                        src={pick.selectedPlayer.espnHeadshot} 
                                        alt={`${pick.selectedPlayer.name} headshot`} 
                                        className="selected-player-headshot"
                                    />
                                    <div className="selected-player-info">
                                        <div className="selected-player-name">{pick.selectedPlayer.espnName}</div>
                                        <div className="selected-player-details">
                                            {pick.selectedPlayer.pos} - {pick.selectedPlayer.team}
                                            <div id="selected-player-school"> {pick.selectedPlayer.school} </div>
                                        </div>
                                    </div>
                                    </div>
                            )}
                            </div>
                        ))}
                        </div>
            </div>
            
            </div>     
            <div className="draft-bottom-container"
                style={{ height: bottomPanelHeight }}
                onMouseMove={isDragging ? doDrag : null}
                onMouseUp={stopDrag}
            >
            <div className="resize-handle" onMouseDown={startDrag}></div>
                <div className="draft-bottom-wrapper">
                    <div className="bottom-panel-left">
                        <div className="player-list">
                            {/* <h2>Available Players</h2> */}
                            <div className="player-search">
                                <input
                                    type="text"
                                    placeholder="Search players..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                                {searchTerm && searchResults.length > 0 && (
                                    <ul className="search-results">
                                        {searchResults.map((player, index) => (
                                        <div className="player-card" key={index} onClick={() => handleSelectPlayer(player)}>
                                            {player.espnHeadshot ? (
                                            <img src={player.espnHeadshot} alt="Player Headshot" className="player-headshot"/>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="player-headshot-default">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                                </svg>
                                            )}
                                                <div className="player-info">
                                                <div className="player-name">{player.espnName}</div>
                                                <div className="player-details">{player.pos} - {player.team} </div>
                                            </div>
                                            <div className="projected-points">{ playerDetails[player.espnID] }</div>
                                        </div>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            {isLoading ? (
                                <p>Loading...</p>
                                ) : (
                                <ul>
                                    {playerList.map((player, index) => (
                                    <li key={index}>
                                        <PlayerCard {...player} handleSelectPlayer={() => handleSelectPlayer(player)}></PlayerCard>
                                    </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
                
            </div>          
    </div>
  );
}

export default DraftPage;