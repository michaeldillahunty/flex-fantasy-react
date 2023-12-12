import React, { useEffect, useState } from "react";
import service from '../API/service';
import './styles/TeamPointsCard.css'


export default function TeamPointsCard({id}) {
    const [teamScoredPoints, setTeamScoredPoints] = useState(0);
    //const [scoredPoints, setScoredPoints] = useState([]);
    const [chemistryBoost, setChemsitryBoost] = useState(0);
    const [boostedScore, setBoostedScore] = useState(0);
    const [chemistryMatches, setChemistryMatches] = useState(null);


    useEffect(() => {
        const fetchTeamPointsScored = async () => {
            if (id) {
              const points = await service.getTeamScoredPoints(id);
              setTeamScoredPoints(points);
              const boost = await service.getChemistryBoost(id);
              setChemsitryBoost(boost);
              const boostedScore = await service.getChemistryBoostedPointsScored(id);
              setBoostedScore(boostedScore);
              const matches = await service.getTeamMatches(id);
              setChemistryMatches(matches);
              console.log('matches', chemistryMatches)
            }
        }
        
        fetchTeamPointsScored();
      }, [id]);


      if (chemistryMatches === null) {
        return <p>Loading...</p>;
      } 
      else if (!teamScoredPoints || !chemistryBoost || !boostedScore) {
        return <p>Loading...</p>;
      }
    
      return (
        <div className='team-points-card'>
          <div className="chemistry-matches">
            <h1>Chemistry Matches</h1>
            <p>College Matches: {chemistryMatches.collegeMatches}</p>
            <p>Team Matches: {chemistryMatches.teamMatches}</p>
            <p>Division Matches: {chemistryMatches.divisionMatches}</p>
          </div>
          <div className="team-points">
            <h1>Points: </h1>
            <p>Team score: {teamScoredPoints.toFixed(2)}</p>
            <p> Team Chemistry Boost Multiplier: {chemistryBoost.toFixed(2)} </p>
            <p> Team Boosted Score: {boostedScore.toFixed(2)} </p>
          </div>
        </div>
      );
}
