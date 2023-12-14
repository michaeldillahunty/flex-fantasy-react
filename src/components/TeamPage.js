import Draggable, {DraggableCore} from 'react-draggable';
import './styles/index.css';
import logoPlaceholder from '../images/logos/logo_notext_192x192.png';
import NavBar from './NavBar';
import service from '../API/service';
import axios from 'axios';
import TeamPlayerModal from './TeamPlayerModal.js'
import PlayerCard from './PlayerCard';
import { ParseJson } from './TeamPageHelper'
import { createPlayerProps } from './TeamPageHelper';
import React, { useEffect, useState } from "react";
import { Link, resolvePath, useLocation, useNavigate, useParams } from "react-router-dom";
import './styles/TeamPage.css'
import TeamPointsCard from './TeamPointsCard';
import { TextField, Button } from '@mui/material';

const TeamPage = (props) => { // props can be an array of player objects that belong to a user 

  const navigator = useNavigate();
  const [teamPlayers, setTeamPlayers] = useState([]);
  const [teamProjectedPoints, setTeamProjectedPoints] = useState(0);
  //const [teamScoredPoints, setTeamScoredPoints] = useState(0);
  const [scoredPoints, setScoredPoints] = useState([]);
  // const [chemistryBoost, setChemsitryBoost] = useState(0);
  // const [boostedScore, setBoostedScore] = useState(0);
  // const [chemistryMatches, setChemistryMatches] = useState(null);
  const params = useParams();
  const id = params.id;
  const [teamName, setTeamName] = useState("");
  const [editingTeamName, setEditingTeamName] = useState(false);
  const [newTeamName, setNewTeamName] = useState(teamName);
  const location = useLocation();
  const [showModal,setShowModal] = useState(false);
  var name = "My Team";
  const colors = {
    QB: '#FF5733',   
    RB: '#33FF57',   
    WR: '#5733FF',   
    TE: '#FF33E6',   
    DEF: '#33E6FF',  
    K: '#E6FF33'     
  };
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleDrag = (e, ui) => {
    const { x, y } = ui;
    setPosition({ x, y });
  };

  const handleStart = (e, ui) => {
    // Handle start of drag if needed
  };

  const handleStop = (e, ui) => {
    // Handle end of drag if needed
  };

  const handleEditClick = () => {
    setEditingTeamName(!editingTeamName);
  }


  const handleUpdateTeam = () => {
    const updatedTeamName = newTeamName.trim();
    if (updatedTeamName !== "") {
      // Only update if the new team name is not empty
      // You can use axios.post or your preferred method to make the API call
      // Example:
      axios.post('https://backend-mn36itr6dq-uc.a.run.app/api/updateTeamName', { teamId: id, newTeamName })
        .then((response) => {
          setTeamName(response.data.teamName);
        })
        .catch((error) => {
          console.error(error);
        });
    }

    // Disable editing mode
    setEditingTeamName(false);
  }
  
  useEffect(() => {
    axios.get(`https://backend-mn36itr6dq-uc.a.run.app/api/getFantasyTeamById/${id}`).then((response) => {
      //console.log(response.data.players);
      setTeamPlayers([...response.data.players]);
      setTeamName([response.data.teamName]);
    });

  }, []);


  useEffect(() => {
    axios.get(`https://backend-mn36itr6dq-uc.a.run.app/api/getTeamProjectedPoints/${id}`)
      .then((response) => {
        setTeamProjectedPoints(response.data);
      })
      .catch((error) => {
        console.error(error);
      })
  });


  useEffect(() => {
    const fetchScoredPoints = async () => {
      const scoredPointsArray = await Promise.all(
        teamPlayers.map(async (player) => {
          const points = await GetScoredPoints(player.espnID);
          return { ...player, scoredPoints: points };
        })
      );
      setScoredPoints(scoredPointsArray);
      // const sum = scoredPoints.reduce((acc, player) => acc + parseFloat(player.scoredPoints), 0);
      // setTeamScoredPoints(sum);
    };

    fetchScoredPoints();
  }, [teamPlayers]);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const handleSearch = async (event) => {
      const { value } = event.target;
      setSearchTerm(value);
      if (value.length > 2) {
          try {
              const results = await service.searchPlayers(value);
              setSearchResults(results);
          } catch (error) {
              console.error("Error searching for players: ", error);
          }
      } else {
          setSearchResults([]);
      }
  };
  async function addPlayertoTeam() {
    var name = document.getElementsByTagName("input")[0].value;
    document.getElementsByTagName("input")[0].value = ""; 
    var res = await service.fetchPlayerData(name);
    var jsonString = ParseJson(res.body[0]);
    var projectedPoints = await service.fetchProjectedPoints(res.body[0].espnID);
    var playerProps = createPlayerProps(jsonString,projectedPoints);


    setTeamPlayers([...teamPlayers, playerProps]);
  }

  const [playerDetails, setPlayerDetails] = useState({});
    const [selectedEspnID, setSelectedEspnID] = useState(null);

  const handleSelectPlayer = async (player) => {
        setSearchTerm('');
        setSearchResults([]);
        setSelectedEspnID(player.espnID); // This will save the espnID in the state
        fetchPlayerDetails(player.espnID);

        const body = {
        "teamId": id,
        "player": player.espnName
        };

        try {
            await axios.post('https://backend-mn36itr6dq-uc.a.run.app/api/addPlayerToTeam', body);
            setTeamPlayers(prevPlayers => [...prevPlayers, player]);

            const response = await axios.get(`https://backend-mn36itr6dq-uc.a.run.app/api/getFantasyTeamById/${id}`);
            setTeamPlayers(response.data.players);
            // Update projected points as well if necessary
        } catch (error) {
            console.error(error);
        }
    }; 

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

  const updateTeam = () => {
    var body = {
      "teamId": id,
      "newPlayers": teamPlayers,
    }

    axios.post('https://backend-mn36itr6dq-uc.a.run.app/api/updateTeamPlayers', body).then(() => {
      axios.get(`https://backend-mn36itr6dq-uc.a.run.app/api/getFantasyTeamById/${id}`)
      .then((response) => {
        setTeamPlayers(response.data.players);
      })
      .catch((error) => {
        console.error(error);
      }) 


    axios.get(`https://backend-mn36itr6dq-uc.a.run.app/api/getTeamProjectedPoints/${id}`)
      .then((response) => {
        setTeamProjectedPoints(response.data);
      })
      .catch((error) => {
        console.error(error);
      })
    })
  };


  const dropPlayer = (playerId) => {
    const teamId = id;
    const requestBody = {
      teamId, 
      playerId
    };
   

    axios.post('https://backend-mn36itr6dq-uc.a.run.app/api/removePlayerFromTeam', requestBody)
      .then((response) => {
        setTeamPlayers(response.data.players);
      })
      .catch((error) => {
        console.error(error);
      }) 

    axios.get(`https://backend-mn36itr6dq-uc.a.run.app/api/getTeamProjectedPoints/${id}`)
    .then((response) => {
      setTeamProjectedPoints(response.data);
    })
    .catch((error) => {
      console.error(error);
    })
  }; 

  const goToMatchup = () => {
    navigator(`/matchup/${id}`, { state: { leagueID: location.state } });
  };

  const GetScoredPoints = async (playerId) => {
    var points = await service.fetchScoredPoints(playerId);
    return points;
  }

  return (
    
    <div className="TeamPage">
      
     
      <header className="header">
        <div className="logo">
          <img src={logoPlaceholder} alt="Logo" />
          <h1 className="title">Flex Fantasy</h1>
        </div>
        <NavBar isLoggedIn = {props.isLoggedIn}/>
      </header>
      {showModal&&<TeamPlayerModal></TeamPlayerModal>}
      <div>
            {/* <ul>
                {scoredPoints.map((player) => (
                <li key={player.espnID}>
                    <div>
                        <strong>{player.playerName}</strong>
                    </div>
                    <div>ESPN ID: {player.playerName}</div>
                    <div>Scored Points: {player.scoredPoints}</div>
                </li>
                ))}
            </ul> */}
      </div>
      <div className='team-name-container'>
        <div className="teamName">

            {editingTeamName ? (
                <div className='team-edit'>
                    <TextField
                      type="text"
                      value={newTeamName}
                      onChange={(e) => setNewTeamName(e.target.value)}
                      variant="outlined"
                      style={{background: '#FAF9F6', marginRight: '20px'}}
                    />
                    <Button style={{background: '#2c3e50'}} variant="contained" onClick={handleUpdateTeam}>
                      Save Team Name
                    </Button>
                    <Button style={{marginLeft: '20px', background: '#2c3e50'}} variant='contained' onClick={() => {setEditingTeamName(false)}} >
                      Cancel Edit
                    </Button>
                </div>
            ) : (
                <div className='team-name-container'> 
                  <h1 className="teamName"> {teamName} </h1>
                  <button className='edit-name-button' onClick={handleEditClick}>
                    {editingTeamName ? "Cancel Edit" : "Edit Team Name ✏️"}
                  </button>
                  <button className='go-to-matchup' onClick={goToMatchup}>Go To Matchup</button>
                </div>
            )}
        </div>
      </div>
      
      <h1 className='team-projected-points'> Projected Points: {teamProjectedPoints.toFixed(2)} </h1>
            <div className="team-wrapper">
              <div className="team-calc-container">
                <TeamPointsCard id = {id} />
              </div>
                <div className="left-container">
                    {teamPlayers.map((player) => (
                        <div className="drop-player-btn-container" key={player._id}>
                            <PlayerCard 
                                positionColor={colors[player.position]}
                                {...player} 
                                dropPlayer={() => dropPlayer(player._id)}
                            />
                        </div>
                    ))}
                </div>
                
                <div className="right-container">
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
                </div>
            </div>
      
        {/* {teamPlayers.map((player,index) => (
            <div key={player._id}>
                <div onClick={()=>setShowModal(true)}>
                    <PlayerCard backgroundColor={colors[player.position]} {...player} />
                        {index === 8 && (<>
                            <h1>bench</h1>
                            <hr></hr>
                        </>)}
                </div>
            </div>
        ))} */}
    </div>  
  );
}
export default TeamPage;