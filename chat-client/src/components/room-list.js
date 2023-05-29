import React from 'react';
import Room from './room';

const RoomList = ({ rooms, onSelectRoom }) => {

  const handleClick = (id) => {
    onSelectRoom(id);
  };

  let list = <div className="no-content-message">There are no rooms to display</div>;

  if (rooms && rooms.map) {

    list = rooms.map((r) => (
      <Room key={r.id} id={r.id} name={r.name} participants={r.participants} onClick={handleClick} />
    ));
  }

  return <div className='room-list'>{list}</div>;
};

export default RoomList;
