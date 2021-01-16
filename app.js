$.fn.extend({
  animateCss: function(animationName, callback) {
    var animationEnd = (function(el) {
      var animations = {
        animation: 'animationend',
        OAnimation: 'oAnimationEnd',
        MozAnimation: 'mozAnimationEnd',
        WebkitAnimation: 'webkitAnimationEnd',
      };

      for (var t in animations) {
        if (el.style[t] !== undefined) {
          return animations[t];
        }
      }
    })(document.createElement('div'));

    this.addClass('animated ' + animationName).one(animationEnd, function() {
      $(this).removeClass('animated ' + animationName);

      if (typeof callback === 'function') callback();
    });

    return this;
  },
});

var socket = io.connect('http://localhost:3005');

function login(){
  $('#username').fadeOut(500);
  setTimeout(()=>{$('#username').remove(); $('#contfjoin').fadeIn(500); setTimeout(()=>{$('#chbgovde').fadeIn(500);},500);}, 500);
}

function rconactive(){
  setTimeout(()=>{$('#backbox').fadeIn(500);}, 900);
}

  $('#usname').click(()=>{
    var inputin = $('#usname').val();
    if(inputin == 'Username?'){
      $('#usname').val('');
    }
  });

  $("#usname").on('keyup', function (e) {
      if (e.keyCode == 13) {
          var username = $('#usname').val();
          socket.emit('socun',username);
          socket.on('sifrelazim',(data)=>{
            if(data == true){
              $('#sifre').fadeIn(500);
            }else{
              login();
            }
          });
      }
  });

  $("#sifre").on('keyup', function (e) {
      if (e.keyCode == 13) {
          var username = $('#usname').val();
          var sifre = $('#sifre').val();
          socket.emit('sifrelilog',{
            uname:username,
            sifre:sifre
          });
          socket.on('sifreliw', (sfw)=>{
            if(sfw == true){
              login();
              rconactive();
            }else{
              $('#username').animateCss('shake');
            }
          });
      }
  });

  $("#message").on('keyup', function (e) {
      if (e.keyCode == 13) {
          var message = $('#message').val();
          if($.trim(message) != ''){
            socket.emit('mesaj',message);
            $('#message').val('');
          }
      }
  });

  $('#gonder').click(()=>{
    var message = $('#message').val();
    if($.trim(message) != ''){
      socket.emit('mesaj',message);
      $('#message').val('');
    }
  });

  $("#backurl").on('keyup', function (e) {
      if (e.keyCode == 13) {
          var backurl = $('#backurl').val();
          if($.trim(backurl) != ''){
            socket.emit('arkaplan',backurl);
            $('#backurl').val('');
          }
      }
  });

  $('#backuyg').click(()=>{
    var backurl = $('#backurl').val();
    if($.trim(backurl) != ''){
      socket.emit('arkaplan',backurl);
      $('#backurl').val('');
    }
  });

  socket.on('arkaurl', (url)=>{
    $('#content').css("cssText", "background-image:url('"+url+"') !important;");
  });

  socket.on('kullanicilar', (data)=>{
    $('#connectedusers').html('');
    $('#bagliks').text(data.length);
    for(var i=0; i < data.length; i++){
      if(data[i] == 'Thorakna'){
        $('#connectedusers').append('<li style="background:orange !important; color:white !important;">'+data[i]+'</li>');
      }else if(data[i] == 'Hami Genç'){
        $('#connectedusers').append('<li style="background:orange !important; color:white !important;">'+data[i]+'</li>');
      }else{
        $('#connectedusers').append('<li>'+data[i]+'</li>');
      }
    }
    console.log(data);
  });

  socket.on('msg', (data)=>{
    $('#chatbox').append('<li>'+data.user+': '+data.mesag+'</li>');
    $("#chatbox").stop().animate({ scrollTop: $("#chatbox")[0].scrollHeight}, 1000);
    console.log(data);
  });

  socket.on('info', (inf)=>{
    $('#chatbox').append('<li class="info">'+inf+'</li>');
    $("#chatbox").stop().animate({ scrollTop: $("#chatbox")[0].scrollHeight}, 1000);
  });

  socket.on('error', function() { console.error(arguments) });
  socket.on('message', function() { console.log(arguments) });
