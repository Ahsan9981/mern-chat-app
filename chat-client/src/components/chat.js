import { useState, useEffect } from 'react';
import socketClient from "socket.io-client";
import './chat.css';
import  MessagesPanel from './message-panel';
import  RoomList from './room-list';

const SERVER = 'http://localhost:5000';

const Chat = () => {

    const [rooms, setRooms] = useState(null);
    const [room, setRoom] = useState(null);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        loadRooms();
        configureSocket();
    }, []);

    const configureSocket = () => {

        const socket = socketClient(SERVER);

        socket.on('connection', () => {
          if (room) {
            handleRoomSelect(room.id);
          }
        });

        socket.on('room', (room) => {

          console.log(rooms, "checking this one")

          const updatedRooms = rooms.map((r) => {
            if (r.id === room.id) {
              return {
                ...r,
                participants: room.participants,
              };
            }
            return r;
          });
          setRooms(updatedRooms);
        });
        
        socket.on('message', (message) => {
          const updatedRooms = rooms.map((r) => {
            if (r.id === message.room_id) {
              const updatedMessages = r.messages ? [...r.messages, message] : [message];
              return {
                ...r,
                messages: updatedMessages,
              };
            }
            return r;
          });
          setRooms(updatedRooms);
        });
        setSocket(socket);
      };

    const loadRooms = async () => {
        const response = await fetch('http://localhost:5000/rooms');
        const data = await response.json();
        setRooms(data.rooms);
        console.log(rooms)
    };

    const handleRoomSelect = (id) => {
        const selectedRoom = rooms.find((r) => r.id === id);
        setRoom(selectedRoom);
        socket.emit('room-join', id, (ack) => {});
      };
    
    const handleSendMessage = (room_id, text) => {
        socket.emit('send-message', {
          room_id,
          text,
          senderName: socket.id,
          id: Date.now(),
        });
    };

    return (
        <div className='chat-app'>
          <RoomList rooms={rooms} onSelectRoom={handleRoomSelect} />
          <MessagesPanel onSendMessage={handleSendMessage} room={room} />
        </div>
    );

}
export default Chat;
