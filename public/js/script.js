

const socket=io()

if (navigator.geolocation){
    navigator.geolocation.watchPosition((position)=>{
        const {latitude,longitude}=position.coords;
        socket.emit("send-location",{latitude,longitude});
    },(error)=>{
        console.log(error)
    },{
        enableHighAccuracy:true,
        timeout:5000,
        maximumAge:0
    })
}

let map=L.map("map").setView([0,0],10);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="/">Live Tracking</a>'
}).addTo(map); 

const markers={};

socket.on("receive-location",(data)=>{
    console.log(data)
    const {id,latitude,longitude}=data;
    map.setView([latitude,longitude],10);
    if(markers[id]){
        markers[id].setLatLng([latitude,longitude])
    
    }else{
        markers[id]=L.marker([latitude,longitude]).addTo(map)
    }
})

socket.on('user-disconnected',(id)=>{
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})