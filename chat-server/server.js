const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, { cors: { origin: '*' }});
const ROOMS = require('./configurations/rooms');


const PORT = process.env.PORT || 5000;

app.use(cors());

io.on('connection', (socket) => {

  console.log('new client connected');
  socket.emit('connection', null);

  socket.on('room-join', id => {

      console.log('room join', id);

      ROOMS.forEach(room => {

          if (room.id === id) {

                if (room.sockets.indexOf(socket.id) == (-1)) {

                    room.sockets.push(socket.id);
                    room.participants++;
                    io.emit('room', room);
                }

              } else {

              let index = room.sockets.indexOf(socket.id);
              if (index != (-1)) {

                room.sockets.splice(index, 1);
                room.participants--;
                io.emit('room', room);
              }
          }
      });

      return id;
  });

  socket.on('send-message', message => {
      io.emit('message', message);
  });

  socket.on('disconnect', () => {

      ROOMS.forEach(room => {

          let index = room.sockets.indexOf(socket.id);

          if (index != (-1)) {

              room.sockets.splice(index, 1);
              room.participants--;
              io.emit('room', room);
          }
      });
  });

});

app.get('/rooms', (req, res) => {
  res.json({
      rooms: ROOMS
  })
});

server.listen(PORT, () => console.log(`Server is listening at port ${PORT}`));
