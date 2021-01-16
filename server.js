var http = require('http'),
    fs = require('fs'),
    ana = fs.readFileSync(__dirname + '/ana.html'),
    css = fs.readFileSync(__dirname + '/app.css'),
    js = fs.readFileSync(__dirname + '/app.js'),
    jsh = fs.readFileSync(__dirname + '/apph.js'),
    index = fs.readFileSync(__dirname + '/index.html');

var app = http.createServer(function(req, res){
  if(req.url == '/ana'){
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(ana);
  }else if(req.url == '/app.css'){
    res.writeHead(200, {'Content-Type': 'text/css'});
    res.end(css);
  }else if(req.url == '/app.js'){
    res.writeHead(200, {'Content-Type': 'application/javascript'});
    res.end(js);
  }else if(req.url == '/apph.js'){
    res.writeHead(200, {'Content-Type': 'application/javascript'});
    res.end(jsh);
  }else{
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(index);
  }
});

var prefix = '[SERVER] ';
var io = require('socket.io').listen(app);
var users = [];

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

io.sockets.on('connection', function (socket){
  function login(user){
    socket.username = user;
    users.push(socket.username);
    console.log(prefix+socket.username+' girdi!');
    io.sockets.emit('info',socket.username+' sunucuya giriş yaptı!');
    io.sockets.emit('kullanicilar', users);
  }
  socket.on('socun', (socd)=>{
    if(socd == 'Thorakna'){
      socket.emit('sifrelazim',true);
    }else if(socd == 'Hami Genç'){
      socket.emit('sifrelazim',true);
    }else{
      socket.emit('sifrelazim',false);
      login(socd);
    }
  });
  socket.on('sifrelilog', (data)=>{
    if(data.uname == 'Thorakna' && data.sifre == 'Asises3520.'){
      socket.emit('sifreliw', true);
      login(data.uname);
    }else if(data.uname == 'Hami Genç' && data.sifre == 'rgbled'){
      socket.emit('sifreliw', true);
      login(data.uname);
    }else{
      socket.emit('sifreliw', false);
    }
  });
  socket.on('mesaj', (msg)=>{
    io.sockets.emit('msg', {
      mesag:msg,
      user:socket.username
    });
  });
  socket.on('arkaplan', (url)=>{
    io.sockets.emit('arkaurl',url);
    io.sockets.emit('info',socket.username+' arkaplanı değiştirdi!');
  });
  socket.on('disconnect', ()=>{
    // Burada çıkarılacak!!
    console.log(prefix+socket.username+' çıktı!');
    users.remove(socket.username);
    io.sockets.emit('info',socket.username+' sunucudan çıkış yaptı!');
    io.sockets.emit('kullanicilar', users);
  });
});

app.listen(3005);
