var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http);
    
app.use('/vendor', express.static(__dirname + '/public/vendor'));
app.use(express.static(__dirname + '/public'));

var chatUsers = {},
    chatNames = ['Sam', 'John', 'Bob', 'Billy', 'Jordan', 'Sally', 'Ester', 'Donald', 'Ron'];
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
io.on('connection', function (socket) {
    var thisId = socket.id;
    if (!(thisId in chatUsers)) {
        chatUsers.thisId = thisId;
        chatUsers[thisId]= chatNames[getRandomInt(0, chatNames.length)];
        console.log('A new user has connected: ');
        console.log('ID = ' + chatUsers.thisId + ', Name = ' + chatUsers[thisId]);
    }
    
    io.emit('chat message', chatUsers[thisId] + ' has connected!');
    socket.on('chat message', function (msg) {
        io.emit('chat message', chatUsers[thisId] + ' says: ' + msg);
    });
    socket.on('disconnect', function () {
        io.emit('chat message', chatUsers[thisId] + ' has disconnected!');
    });
});

http.listen(process.env.PORT || 3000, function () {
    console.log('Express server running!');
});