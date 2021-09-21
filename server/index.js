const http = require('http');
const express = require('express');
const socket = require('socket.io');
const cors = require('cors');

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socket(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  }
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());
app.use(router);

const rooms = new Map([]);

app.get('/rooms/:id', (req, res) => {
  const roomID = req.params.id;
  const obj = rooms.has(roomID) ? {
    users: [...rooms.get(roomID).get('users').values()],
    messages: [...rooms.get(roomID).get('messages')],
  } : { users: [], messages: [] }
  res.json(obj)
})

app.post('/rooms', (req, res, next) => {
  const { roomID } = req.body;
  if (!rooms.has(roomID)) {
    rooms.set(roomID, new Map([
      ['users', new Map()],
      ['messages', []],
    ]));
  }
  res.send({ response: "Room has wrote" }).status(200);
})

io.on('connection', (socket) => {
  socket.on('ROOM:JOIN', ({ roomID, userName }) => {
    socket.join(roomID);
    rooms.get(roomID).get('users').set(socket.id, userName);
    const users = [...rooms.get(roomID).get('users').values()];
    socket.broadcast.to(roomID).emit('ROOM:JOINED', users);
  })

  socket.on('ROOM:NEW_MESSAGE', ({ roomID, userName, text }) => {
    const obj = {
      userName,
      text,
    }
    rooms.get(roomID).get('messages').push(obj)
    socket.broadcast.to(roomID).emit('ROOM:NEW_MESSAGE', obj)
  })

  socket.on('disconnect', () => {
    rooms.forEach((value, roomID) => {
      if (value.get('users').delete(socket.id)) {
        const users = [...value.get('users').values()];
        socket.broadcast.to(roomID).emit('ROOM:LEAVE', users);
      }
    })
  })
})

server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`));