import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, Typography, List, ListItem, ListItemText, InputAdornment } from "@mui/material";


const SendInvitesPage = ({ onSendInvite, leagueId }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchClicked, setSearchClicked] = useState(false);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`https://backend-mn36itr6dq-uc.a.run.app/api/searchUsers?email=${query}`);
      setResults(response.data);
      setErrorMessage("");
      setSearchClicked(true); // Set searchClicked to true when the search button is clicked
    } catch (error) {
      console.error('Error searching for users:', error);
      setErrorMessage('Error searching for users. Please try again.');
    }
  };

  const handleSendInvite = (userId) => {
    // Assuming onSendInvite is a function that sends an invite
    onSendInvite(userId, leagueId);
  };

  return (
    <div className="SendInvitesPage">
      <TextField
        label="Search"
        variant="outlined"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ background: 'white', margin: '25px', color: '#ff9800' }} // Set white background
        InputLabelProps={{
          style: { color: '#2c3e50' },
        }}
      />
      <Button style={{marginTop: '25px'}} variant="contained" onClick={handleSearch}>
        Search
      </Button>

      {errorMessage && <Typography color="error">{errorMessage}</Typography>}

      {searchClicked && results.length > 0 ? (
        <List>
          {results.map((user) => (
            <ListItem key={user._id} button>
              <ListItemText primary={`${user.name} - ${user.email}`} />
              <Button variant="outlined" onClick={() => handleSendInvite(user._id)}>
                Send Invite
              </Button>
            </ListItem>
          ))}
        </List>
      ) : searchClicked ? (
        <Typography>No users found with email {query}</Typography>
      ) : null}
    </div>
  );
};

export default SendInvitesPage;