import React, { useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import NavBar from './NavBar';
import service from '../API/service';
import { useAuth } from '../authContext'; // Import useAuth
import axios from "axios";

const NewTeam = () => { // Remove props here
  const { isLoggedIn, user } = useAuth(); // Use useParams to access route parameters
  const [teamName, setTeamName] = useState("");


  const test = () => {
    axios.get('https://backend-mn36itr6dq-uc.a.run.app/api/getAllTeamsForUser',  { withCredentials: true })
        .then((response) => {
            console.log(JSON.stringify(response.data, null, 2));
        })
        .catch((error) => {
            console.error(error);
        })
  };



  async function saveTeam() {
    try {
      // Check if the user is logged in before making the API call
      if (isLoggedIn === true) { // Note: "true" is a string, so we compare it as a string
        const response = await service.createFantasyTeam(teamName, user._id, {
          withCredentials: true
        });
        console.log("Team saved:", response);
        // Handle after save (e.g., redirect to team page or display a message)
      } else {
        // Handle the case when the user is not logged in
        console.log("User is not logged in. Please log in to save a team.");
      }
    } catch (error) {
      console.error("Error saving the team: ", error);
    }
  }

  return (
    <div className="NewTeamPage">
      <NavBar isLoggedIn={isLoggedIn === true} /> {/* Convert isLoggedIn to a boolean */}
      {isLoggedIn === true ? (
        <>
          <p>Welcome, {user.name}!</p>
          {/* You can access other user properties like props.user.email, props.user.id, etc. */}
        </>
      ) : null} 
      <button onClick={() => test()} >Test</button>
      <div className="team-creation-form">
        <input
          type="text"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="Enter team name"
        />
        <button onClick={() => saveTeam()}>
          Create Team
        </button>
      </div>
    </div>
  );
};

export default NewTeam;
