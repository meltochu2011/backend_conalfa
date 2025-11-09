import express from 'express'
import path from 'path'
//import socket from 'socket.io'

const app= express();

import indexRoutes from './routes/indexroutes'

import { socket_orders } from './controllers/socket_orders';

//midelwares
app.use(express.json());
app.use(express.urlencoded({extended:false}));
const cors = require('cors');

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.use(indexRoutes);

// Rutas simples para prueba
app.get('/', (req, res) => res.send('Servidor funcionando'));
app.get('/test', (req, res) => res.json({ hora: new Date().toISOString() }));

import { pool } from './db'; // ajusta el path según tu proyecto

app.get('/dbcheck', async (req, res) => {
  try {
    console.log('Ejecutando consulta a PostgreSQL...');
    const result = await pool.query('SELECT NOW()');
    console.log('Resultado DB:', result.rows);
    res.json({ ok: true, time: result.rows[0].now });
  } catch (err: any) {
    console.error('Error en /dbcheck:', err);
    res.status(500).json({ error: err.message });
  }
});

app.set('port', process.env.PORT || 4000);

const server = require('http').Server(app)

server.listen(app.get('port'),'0.0.0.0',() => {
     
    console.log('Ready, the port is '+app.get('port'))

})

//app.use(express.static(path.join(__dirname,'public')));
app.use(cors());


const io= require('socket.io')(server,{
    cors: 
    {
      origins: ['http://localhost:3002','http://localhost:4200', 'https://joockuu.vercel.app','http://localhost:3000', 'https://back-v9n1.onrender.com','http://localhost:3500']
    }

}
  
)

/*
io.on("connection", (socket) => {
    socket.on("update item", (arg1, arg2, callback) => {
      console.log(arg1); // 1
      console.log(arg2); // { name: "updated" }
      callback({
        status: "ok"
      });
    });
  });*/


io.on('connection',(socket: any) => {
  //if(contador <= 15)
     const {groupname} = socket.handshake.query;
     console.log('Hola dispositivo',socket.id," group name ",groupname);
     socket.join(groupname);

    setInterval(async () => {
    }, 3000)

    socket.on('event',(res: any)=>{
         const data = res;

            socket.to(groupname).emit('event',data);     
    })



    
    socket.on('dataevent',async (res: any, callback: any)=>{
        const data = res;

        
        const resp= socket_orders.order_createOrderjson(res);
           if(await resp == true)
            {               
                socket.to(groupname).emit('event','delivery'); 
                //io.to(socket.id).emit('unicast',true);
                callback({
                    status: true
                  });                      
            }

            if(await resp == false)
            {
                callback({
                    status: false
                  });
            }
                
   })
 
});


/**INSTANCIA PARA TENER DISPONIBLE LA CARPETA UPLOADS, EN DONDE ESTAN LAS IMAGENES */
app.use('/uploads', express.static( path.resolve('uploads') ) );