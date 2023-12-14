import React, { useEffect, useState } from 'react';


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

const searchPlayers = async (searchTerm) => {
    const response = await fetch(`/search-players?term=${encodeURIComponent(searchTerm)}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
};

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