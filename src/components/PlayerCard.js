
import './styles/PlayerCard.css'; 

const PlayerCard = (props) => {

  const { headshot, name, position, projectedPoints, college, division, team, dropPlayer, backgroundColor, positionColor } = props;

  // Define a color scheme for your card
  const cardStyle = {
    backgroundColor: props.backgroundColor, // Example color
    color: 'white',
  };
  
  const positionStyle = {
    backgroundColor: positionColor
  }

  return (
    <div className="player-card" style={cardStyle}>
      <div className="left-column">
        <div className="position-bg" style={positionStyle}>
          <p className="position">{position}</p>
        </div>
      </div>
      <div className="center-column">
        <img className="headshot" src={headshot} alt={`${name}'s headshot`} />
      </div>      
      <div className="right-column">
        <div className="player-cell-info">
          <div className="player-card-main-row">
            <span className="name">{name} </span>
            <span className="meta-position">{position} -</span>
            <span className="meta-team">{team}</span>
          </div>
          <div className="player-card-second-row">
            <div className='player-meta-col'>
              <span className="division-meta"> {division} </span>
              <span className="college-meta"> {college} </span>
            </div>
          </div>
        </div>
        
      </div>
      <div className="test-column">
        <span className="actual-points"> - </span>
        <span className="projected-points">Proj. {projectedPoints}</span>
      </div>
      <div className='drop-player-container'>
        <button className="drop-player-btn" onClick={dropPlayer}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Drop</span>
        </button>
          

      </div>
    </div>

  );
};

export default PlayerCard;
