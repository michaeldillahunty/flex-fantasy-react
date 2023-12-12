
import service from "../API/service";
  export function ParseJson(jsonString){
    try {
       
        const jsonObject = JSON.parse(JSON.stringify(jsonString));
        
        return jsonObject // Output: { name: 'John', age: 30, city: 'New York' }
      } catch (error) {
        console.error('Invalid JSON:', error);
        return {};
      }
}

export function createPlayerProps(jsonString, proj)  {
  const nflTeamDivisions = {
    DAL: 'NFC East',
    PHI: 'NFC East',
    WAS: 'NFC East',
    NYG: 'NFC East',
    GB: 'NFC North',
    MIN: 'NFC North',
    CHI: 'NFC North',
    DET: 'NFC North',
    NO: 'NFC South',
    TB: 'NFC South',
    CAR: 'NFC South',
    ATL: 'NFC South',
    SEA: 'NFC West',
    LAR: 'NFC West',
    ARI: 'NFC West',
    SF: 'NFC West',
    NE: 'AFC East',
    BUF: 'AFC East',
    MIA: 'AFC East',
    NYJ: 'AFC East',
    KC: 'AFC West',
    LVR: 'AFC West',
    LAC: 'AFC West',
    DEN: 'AFC West',
    PIT: 'AFC North',
    BAL: 'AFC North',
    CLE: 'AFC North',
    CIN: 'AFC North',
    TEN: 'AFC South',
    IND: 'AFC South',
    HOU: 'AFC South',
    JAC: 'AFC South',
  };
  
  const team = jsonString.team;
  
  return{
    headshot: jsonString.espnHeadshot,
    name: jsonString.espnName,
    position: jsonString.pos,
    projectedPoints: proj,
    college: jsonString.school,
    division: nflTeamDivisions[team],
    team: team,
    espnID: jsonString.espnID
  };

  
    
  

}