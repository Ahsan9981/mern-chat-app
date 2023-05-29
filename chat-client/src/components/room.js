const Room = ({ id, name, participants, onClick }) => {

    const handleClick = () => {
      onClick(id);
    };
  
    return (
      <div className='room-item' onClick={handleClick}>
        <div>{name}</div>
        <span>{participants}</span>
      </div>
    );
  };
  
  export default Room;