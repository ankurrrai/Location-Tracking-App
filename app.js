import express from "express"
import http from 'http';
import {Server} from 'socket.io'
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
// import { Server } from "engine.io";

const __filename=fileURLToPath(import.meta.url);
const __dirname=dirname(__filename);
const port=process.env.port || 8000;
const app=express();

app.set('view-engine','ejs')
app.set('views','./views')
app.use(express.static(path.join(__dirname,'public')))

// setup the socket.io server
const httpServer=http.createServer(app);
const io=new Server(httpServer);

// eastablished connection
io.on("connection",function(socket){
    console.log('Socket is connected with server')
    socket.on("send-location",function(data){
        io.emit("receive-location",{id:socket.id,...data})
    })

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        io.emit('user-disconnected',socket.id)
      });
})



app.get('/',(req,res)=>{
    return res.render('index.ejs')
})

httpServer.listen(port,(error)=>{
    if(error){console.log(`Error while starting the server :${error}`);}
    console.log(`Serever is started at port : ${port}`)
})