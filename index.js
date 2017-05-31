/**
 * 
 */
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
})

var usernames = {};
var playlist={};
var playtable={};



io.on('connection',function(socket){
    console.log('one user connected '+socket.id);
    io.sockets.in(socket.room).emit('message', 'hello there');



    socket.on('adduser', function(username){
    socket.nickname = username;
    console.log('username '+username);

    usernames[username] = username;

      });

       
     
     socket.on('newjoin', function(groupname){

      console.log('new username '+groupname);
 
          for (var playsong in playtable)  {


            if(playtable[playsong].groupName==groupname){

                        console.log('Grup1: '+playtable[playsong].groupName);

                        console.log('sarkilar1: '+playtable[playsong].playingsong);

                        io.sockets.in(socket.room).emit('newjoin', playtable[playsong].playingsong);  


             }
     

     }

      });



     socket.on('playingsong', function(data){

          var istek = data.istek;
          var grupname = data.grupname;

          if(istek=='necaliyo'){

          io.sockets.in(socket.room).emit('playingsong', 'necaliyo');  

          }

      });


     socket.on('seeksong', function(data){

          var playinguri = data.song;
          var seek = data.seek;
          var grupname = data.grupname;


          console.log('playinguri: '+playinguri);
          console.log('seek: '+seek);
          console.log('grupname: '+grupname);


          io.sockets.in(socket.room).emit('seeksong',data);  

        
      });

          socket.on('seeksong_1', function(data){

          var playinguri = data.song;
          var seek = data.seek;
          var grupname = data.grupname;


          console.log('playinguri: '+playinguri);
          console.log('seek: '+seek);
          console.log('grupname: '+grupname);


          io.sockets.in(socket.room).emit('seeksong_1',data);  

        
      });


    socket.on('room', function(room) {
        socket.room =room;
        socket.join(room);
        console.log('room no '+room);
     
     for (var username in usernames)  {
     
          console.log('userlar: '+usernames[username]);
     }

    });  



    Object.keys(io.sockets.sockets);
    Object.keys(io.sockets.sockets).forEach(function(id) {
    console.log("ID:",id)  // socketId
    }) ;

  
   


    socket.on('message',function(data){
        //var sockets = io.sockets.sockets;
         io.sockets.in(socket.room).emit('message', data);

      //  socket.in(room).emit('message', data);
          console.log(data);

    })  


 

    socket.on('playlist',function(data){

        // io.sockets.in(socket.room).emit('playlist',playsong,grup);

          var playsong = data.musicname;
          var grupname = data.grupname;

          console.log("sarki:"+playsong);
   
          console.log("grup:"+grupname);

          playlist[playsong] = playsong;

          playtable[playsong]={groupName:grupname,playingsong:playsong};


    }) 


   



    socket.on('disconnect',function(){
        console.log('one user disconnected '+socket.id);
    })
});


http.listen(3000,function(){
    console.log('server listening on port 3000');
})
