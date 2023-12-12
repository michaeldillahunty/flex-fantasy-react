import React, {useState, useEffect} from "react";
import axios from "axios";
import NavBar from "./NavBar";
import InviteCard from "./InviteCard";
import "./styles/InvitePage.css";

export default function InvitesPage(props) {
    const [invites, setInvites] = useState([]);
    const [inviteDetails, setInviteDetails] = useState([]);


    const fetchInviteDetails = async () => {
        const details = await Promise.all(
            invites.map(async (inviteId) => {
            try {
                const response = await axios.get(`http://localhost:8000/api/getFantasyLeagueById/${inviteId}`);
                return response.data; 
            } catch (error) {
                console.error(`Error fetching league info for ${inviteId}`, error);
                return null;
            }
            })
        );

        setInviteDetails(details);
    };


    useEffect(() => {
        axios.get(`http://localhost:8000/api/getLeagueInvites`,  { withCredentials: true })
            .then((response) => {
                setInvites(response.data);
            })
            .catch((error) => {
                console.error(error);
            })
    }, []);


    useEffect(() => {
        const fetchInviteDetailsIfNeeded = async () => {
          if (invites.length > 0) {
            await fetchInviteDetails();
          }

          else {
            setInviteDetails([]);
          }
        };
      
        fetchInviteDetailsIfNeeded();
      }, [invites]);

    
    const fetchInvites = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/api/getLeagueInvites`, { withCredentials: true }); // Include withCredentials
          setInvites(response.data);
        } catch (error) {
          console.error('Error fetching invites:', error);
        }
      };


    const acceptInvite = async (inviteId) => {
        axios.post(`http://localhost:8000/api/acceptInvite/${inviteId}`, null, { withCredentials: true })
            .then((response) => {
                console.log(response);
                setInvites(prevInvites => prevInvites.filter(id => id !== inviteId));
                setInviteDetails(prevDetails => prevDetails.filter(detail => detail._id !== inviteId));
            })
      };
    

    const declineInvite = (inviteId) => {
        axios.post(`http://localhost:8000/api/declineInvite/${inviteId}`, null, { withCredentials: true })
            .then((response) => {
                setInvites(response.data);
                setInviteDetails(prevDetails => prevDetails.filter(detail => detail._id !== inviteId));
            })
            .catch((error) => {
                console.error(error);
            })
    };



    return (
        <div className="InvitesPage">
            <NavBar isLoggedIn = {props.isLoggedIn}/>
            <h1 className="invite-header"> Invites: </h1>
            <ul>
                {inviteDetails.map((details, index) => (
                <li key={invites[index]}>
                    {details ? (
                        <InviteCard 
                            leagueName={details.leagueName}
                            acceptInvite={() => acceptInvite(invites[index])}
                            declineInvite={() => declineInvite(invites[index])}
                        />
                    ) : (
                    <p>Error fetching details for invite ID: {invites[index]}</p>
                    )}
                </li>
                ))}
            </ul>
        </div> 
    )
}
