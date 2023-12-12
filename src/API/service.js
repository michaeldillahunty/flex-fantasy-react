import myAxios from './axios.js';

class ApiService {
    fetchPlayerData = async (playerName) => {
        try {

            const response = await myAxios.get('/api/nflPlayerInfo/', {
                params: {
                    player: playerName
                }
            });


            return response.data;
        } catch (error) {
            console.error('Error fetching player data:', error);
            throw error;
        }
    };

    fetchTeamSchedule = async (teamAbv, season) => {
        try {
            const response = await myAxios.get('/nflTeams/getTeamSchedule', {
                params: {
                    teamAbv: teamAbv,
                    season: season
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching team schedule:', error);
            throw error;
        }
    };
    fetchCurrentMatchup = async (teamId,schedule) => {
        var body = {
            "teamId": teamId,
            "schedule": schedule
           }
           console.log("schedule",schedule);
           console.log("teamid: ",teamId);
           
try{
    const response = await myAxios.post('/api/getCurrentMatchup/',body, {withCredentials:true});
    
    return response.data;
    
}
catch(error){
console.error('error getting matchup',error);
throw error;
}
    };
    
    fetchPlayerByID = async (playerId) => {
        try {
            const response = await myAxios.get('/api/getNFLPlayer_id/', {
                params: {
                    id: playerId
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error getting player by ID', error);
            throw error;
        }
    };

    fetchFantasyDraftList = async () => {
        try {const response = await myAxios.get('/api/fantasyDraftList/');
        return response.data;
    }
    catch(error){
        console.error('error getting player draft list');
        throw error;
    }
    };

    fetchProjectedPoints = async (playerID,week) =>
    {
        try {
            const response = await myAxios.get(`/api/projectedNflPlayerStats/${playerID}/`);
            return response.data;
        } catch (error) {
            console.error('Error getting proj points', error);

            throw error;
        }
    };

    fetchScoredPoints = async (playerId) => {
        try {
            const response = await myAxios.get(`/api/scoredNFLPlayerPoints/${playerId}`);
            return response.data;
        }
        catch (error) {
            console.error('Error getting scored points', error);
            throw error;
        }
    }

    getChemistryBoostedPointsScored = async (playerId) => {
        try {
            const response = await myAxios.get(`/api/getChemistryBoostedPointsScored/${playerId}`);
            return response.data;
        }
        catch (error) {
            console.error('Error getting chemistry boosted score');
            throw error;
        }
    }

    getChemistryBoost = async (playerId) => {
        try {
            const response = await myAxios.get(`/api/getChemistryScore/${playerId}`);
            return response.data;
        }
        catch (error) {
            console.error('Error getting chemistry boost');
            throw error;
        }
    }

    getTeamMatches = async (playerId) => {
        try {
            const response = await myAxios.get(`/api/getTeamMatches/${playerId}`);
            return response.data;
        }

        catch (error) {
            console.error('Error getting matches');
            throw error;
        }
    }

    getTeamScoredPoints = async (playerId) => {
        try {
            const response = await myAxios.get(`/api/getTeamPointsScore/${playerId}`);
            return response.data;
        }

        catch (error) {
            console.error('Error getting scored points');
            throw error;
        }
    }

    fetchLiveScoreboard = async () => {
        try {
            const response = await myAxios.get('/api/liveScoreboards/');
            return response.data;
        } catch (error) {
            console.error('Error getting player by ID', error);

            throw error;
        }
    };
    createFantasyTeam = async (teamName, players, ownerId) => {
       var body = {
        "ownerId": ownerId,
        "teamName":teamName,
        "players": players,
       }
        try {
            const response = await myAxios.post('/api/newTeam/', body, { withCredentials: true });
            return response.data;
        } catch (error) {
            
            console.error('Error Creating Team', error);
            throw error;
        }
    };
    
    getFantasyTeam = async (teamName) => {
        try {
            const response = await myAxios.get(`/api/newTeam/${teamName}`);
            return response.data;
        } catch (error) {
            console.error('Error Getting Team', error);
            throw error;
        }
    };

    registerUser = async (name,username,email,password,confirmPassword) => {
        var body = {
            "name":name,
            "username": username,
            "email":email,
            "password": password,
            "confirm_pwd": confirmPassword
           }
        try {
            const response = await myAxios.post(`/api/users/register`,body);
            return response.data;
        } catch (error) {
            console.error('Error Registering User', error);
            throw error;
        }
    };

    loginUser = async (email, password) => {
        var body = {
            "email": email,
            "password": password,
        }
        
        try {
            const response = await myAxios.post(`/api/users/verify`, body);
            return response.data;
        } catch (e) {
            console.error(e.message);
        }
    }

    // Service for logging a user in using Google OAuth2.0
    fetchGoogleUserData = async () => {
        try {
            window.location.href = 'http://ec2-18-217-120-233.us-east-2.compute.amazonaws.com/auth/google';
        } catch (e) {
            console.error(e.message);
        }
    }

    logoutUser = async() => {
        try {
            const response = await myAxios.get(`/auth/logout`);
            return response.data;
        } catch (e) {
            console.error(e.message);
        }
    }

    searchPlayers = async (searchTerm) => {
        const response = await myAxios.get(`/api/search-players?term=${encodeURIComponent(searchTerm)}`);
        return response.data;
    };

}


export default new ApiService();

