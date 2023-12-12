import React from "react";
import './styles/InviteCard.css'


export default function InviteCard({leagueName, acceptInvite, declineInvite}) {
    return (
        <div className="InviteCard">
            <h1 className="league-name"> {leagueName} </h1>
            <div className="button-container">
                <button className="accept-button" onClick={acceptInvite}> Accept Invite </button>
                <button className="decline-button" onClick={declineInvite}> Decline Invite </button>
            </div>
        </div>
    )
}