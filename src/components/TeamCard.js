import React, { useEffect, useState }from "react";
import axios from "axios";
import './styles/TeamCard.css';


export default function TeamCard({teamName, teamId, teamOwner}) {
    const [projectedPoints, setProjectedPoints] = useState(0);
    const [ownerName, setOwnerName] = useState('');
    
    useEffect(() => {
        axios.get(`https://backend-mn36itr6dq-uc.a.run.app/api/getTeamProjectedPoints/${teamId}`)
            .then((response) => {
                setProjectedPoints(response.data);
            })
            .catch((error) => {
                console.error(error);
            })
    })


    useEffect(() => {
        axios.get(`https://backend-mn36itr6dq-uc.a.run.app/api/getTeamOwnerName/${teamOwner}`)
            .then((response) => {
                setOwnerName(response.data);
            })
            .catch((error) => {
                console.error(error);
            })
    })


    return (
        <div className="teamCard" >
            <div className="teamCard-col">
                <span className="teamCard-name"> {teamName} </span>
                <span className="teamCard-proj"> Proj - {projectedPoints.toFixed(2)} </span>
            </div>
            <div className="teamCard-col">
                <span className="teamCard-owner"> Team Owner: {ownerName} </span>
            </div>
        </div>
    )
}