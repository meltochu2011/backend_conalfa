import multer from 'multer'

import uuid from 'uuid'
import path from 'path'


    const obtenerNumeroAleatorioEnRango = (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    let nombre= "";


   

 const storage= multer.diskStorage({

    destination: 'uploads',
     
   
    filename : (req, file, cb) =>{
    
        //Para obtener unicamente la extension de la imagen es           path.extname(file.originalname)
         cb(null, obtenerNumeroAleatorioEnRango(100,400)+obtenerNumeroAleatorioEnRango(1,100)+file.originalname);
        nombre=file.originalname;
    }

});

export default multer({storage})