import React, {useState} from "react";


export default function AddLeagueForm({ onCreateLeague }) {
    const [leagueName, setLeagueName] = useState('');
    const [leagueMembers, setLeagueMembers] = useState('');
    const [teams, setTeams] = useState([]);


    const handleCreateLeague = () => {
        onCreateLeague({ leagueName, leagueMembers, teams })

        setLeagueMembers('');
        setLeagueName('');
    }


    return (
        <div className="AddLeagueForm">
            <h1>Create New League</h1>
            <input
                type="text"
                placeholder="League Name"
                value={leagueName}
                onChange={(e) => setLeagueName(e.target.value)}
            />
            <input
                type="number"
                placeholder="Number of League Members"
                value={leagueMembers}
                onChange={(e) => setLeagueMembers(e.target.value)}
                min={0}
                max={12}
            />
            <button onClick={handleCreateLeague}>Create League</button>
        </div>
    )
    
}