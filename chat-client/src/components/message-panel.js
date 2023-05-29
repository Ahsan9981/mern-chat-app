import React, { useState } from 'react';
import Message from './message';

const MessagesPanel = ({ room, onSendMessage }) => {

  const [inputValue, setInputValue] = useState('');

  const send = () => {

    if (inputValue && inputValue !== '') {
      onSendMessage(room.id, inputValue);
      setInputValue('');
    }

  };

  const handleInput = (e) => {
    setInputValue(e.target.value);
  };

  let list = <div className="no-content-message">There are no messages to show</div>;
  if (room && room.messages) {
    list = room.messages.map((m) => (
      <Message key={m.id} id={m.id} senderName={m.senderName} text={m.text} />
    ));
  }

  return (
    <div className='messages-panel'>
      <div className="messages-list">{list}</div>
      {room && (
        <div className="messages-input">
          <input type="text" onChange={handleInput} value={inputValue} />
          <button onClick={send}>Send</button>
        </div>
      )}
    </div>
  );
};

export default MessagesPanel;