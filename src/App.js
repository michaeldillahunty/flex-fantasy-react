import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './components/styles/index.css';
import { Navigate, Routes, Route, useLocation } from "react-router-dom";
import Home from "./components/Home";
import TeamPage from "./components/TeamPage";
import LoginPage from './components/LoginPage';
import LeaguePage from './components/LeaguePage';
import MyLeaguesPage from './components/MyLeaguesPage';
import NewTeam from './components/NewTeam';
import { AuthProvider } from './authContext'; // Import the AuthProvider
import DraftPage from './components/DraftPage';
import UserTeamsPage from './components/UserTeamsPage';
import InvitesPage from './components/InvitesPage';
import SendInvitesPage from './components/SendInvitesPage';
import MatchupPage from './components/MatchupPage';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    const handleLogin = () => {
        setIsLoggedIn(true);
        
    }

    const handleLogout = async () => {
      try {
          await axios.post('/auth/logout');
          setUser(null);
          setIsLoggedIn(false);
      } catch (error) {
          console.error(error);
      }
    }
    const ProtectedRoute = ({ children }) => {
        if (!isLoggedIn) {
          // Redirect them to the /login page, but save the current location they were
          // trying to go to when they were redirected. This allows us to send them
          // along to that page after they login, which is a nicer user experience
          // than dropping them off on the home page.
          return <Navigate to="/login" />;
        }
  
        return children;
    };

    useEffect(() => {
        // // Fetch the current user when the app initializes
        // async function fetchCurrentUser() {
        //     try {
        //         const response = await axios.get('https://backend-mn36itr6dq-uc.a.run.appauth/currentUser');
        //         // if (response == null) { 
        //         //     console.error('No user currently logged in')
        //         // }
        //         console.log("Fetch Current User (App.js) : " + response.data);
                
        //         if (response.data) {
        //             setUser(response.data);
        //             setIsLoggedIn(true);
        //         }
        //         setIsLoggedIn(false);
        //     } catch (error) {
        //         console.error("Error fetching current user:", error);
        //     }
        // }
        async function fetchCurrentUser() {
            try {
                const response = await axios.get('https://backend-mn36itr6dq-uc.a.run.app/auth/currentUser');
                
                if (response.data) {
                    setUser(response.data);
                    setIsLoggedIn(true);
                } else {
                    //setIsLoggedIn(false);
                }
            } catch (error) {
                console.error("Error fetching current user:", error);
            }
        }

        

        fetchCurrentUser();
    }, []);


    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const sessionData = query.get('session');
    useEffect(() => {
        if (sessionData) {
            // Parse the session data JSON string
            const session = JSON.parse(decodeURIComponent(sessionData));

            // Check if the session contains user data
            if (session && session.user) {
                setUser(session.user);
                setIsLoggedIn(true);
            }
        }
    }, [sessionData]);

    return (
        <div>
            <div className="REMOVE-THIS">
                {user ? (
                    <>
                        <p>Welcome, {user.name}!</p>
                        <button className="logout-btn" onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <p>Please log in.</p>
                )}
            </div>

        
            <AuthProvider>
                <div className="App">
                    <Routes>
                        <Route path="/" element={isLoggedIn ? <Home isLoggedIn={isLoggedIn} /> : <LoginPage onLogin={handleLogin} />} />
                        <Route path="/team/:id" element={<TeamPage isLoggedIn={isLoggedIn}/>} />
                        <Route path="/login" element={<LoginPage isLoggedIn={isLoggedIn}/>} />
                        <Route path='/myLeagues' element={<MyLeaguesPage isLoggedIn={isLoggedIn}/>} />
                        <Route path='/league/:id' element={<LeaguePage isLoggedIn={isLoggedIn}/>} />
                        <Route path='/matchup/:id' element= {<MatchupPage isLoggedIn={isLoggedIn}/>} />

                        <Route path="/newTeam" element={<NewTeam isLoggedIn={isLoggedIn} />} />
                        <Route path='/draft/:id' element={<DraftPage/>}/>
                        <Route path='/userTeams' element={<UserTeamsPage isLoggedIn={isLoggedIn}/>}/>
                        <Route path='/invites' element={<InvitesPage user={user} isLoggedIn={isLoggedIn}/>}/>
                        
                        <Route path='/sendInvites' element={<SendInvitesPage isLoggedIn={isLoggedIn} />} />
                    </Routes>
                </div>
            </AuthProvider>
        </div>
    );
}

export default App;