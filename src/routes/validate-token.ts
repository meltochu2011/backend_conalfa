import {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'


const validatetoken = (req: Request,res: Response, next : NextFunction) =>{
     //console.log('validate token');
     const headerToken = req.headers['authorization'];
     

     if(headerToken != undefined && headerToken.startsWith('Bearer'))
     {
          try {
          const bearerToken = headerToken.slice(7);
          jwt.verify(bearerToken,''+process.env.SECRET_KEY)
          next();

          } catch (error) {
          
               res.status(401).json({
                    msj:'Acceso denegado'
               })
          }
          
     }
     else{
          res.status(401).json({
               msg:'Acceso denegado'
          })
     }
}

export default validatetoken;