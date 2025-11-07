import bodyParser from 'body-parser';
import { query, Request, Response} from 'express'
import {Query, QueryResult}  from 'pg'
import {pool} from '../database'

import path from 'path'
import fs from 'fs-extra'
import { Socket } from 'socket.io';


//this.ioSocket.emit('external_nologedin',"extern");


//OBTENER VOCALES
export const getVowels = async (req: Request, res: Response): Promise <Response> =>{
    
    const count=parseInt(req.params.count);

    try {
        const response: QueryResult = await pool.query("SELECT * FROM letter where type='v'");
        
        return  res.status(200).json(response.rows);
        
        } catch (error) {
        console.log(error)
       
        return  res.status(500).json('Verificar: '+error);
    }
    
}

//OBTENER CONSONANTES
export const getConsonants = async (req: Request, res: Response): Promise <Response> =>{
    
    const count=parseInt(req.params.count);

    try {
        const response: QueryResult = await pool.query(" SELECT * FROM letter where type='c' ");
        
        return  res.status(200).json(response.rows);
        
        } catch (error) {
        console.log(error)
       
        return  res.status(500).json('Verificar: '+error);
    }
    
}

//OBTENER PALABRAS
export const getSyllable_word = async (req: Request, res: Response): Promise <Response> =>{
    
    const count=parseInt(req.params.count);

    try {
        const response: QueryResult = await pool.query("SELECT * FROM syllable_word where type='w'");
        
        return  res.status(200).json(response.rows);
        
        } catch (error) {
        console.log(error)
       
        return  res.status(500).json('Verificar: '+error);
    }
    
}

//OBTENER SILABAS

export const getSyllable = async (req: Request, res: Response): Promise <Response> =>{
    
    const count=parseInt(req.params.count);

    try {
        const response: QueryResult = await pool.query("SELECT * FROM syllable_word where type='s'");
        
        return  res.status(200).json(response.rows);
        
        } catch (error) {
        console.log(error)
       
        return  res.status(500).json('Verificar: '+error);
        
    }
    
}


export const getphrase = async (req: Request, res: Response): Promise <Response> =>{
    

    
    const count=parseInt(req.params.count);

    try {
        const response: QueryResult = await pool.query("SELECT * FROM syllable_word where type='p'");
        
        return  res.status(200).json(response.rows);
        
        } catch (error) {
        console.log(error)
       
        return  res.status(500).json('Verificar: '+error);
        
    }
    
}

//OBTENER TAREA

export const get_task = async (req: Request, res: Response): Promise <Response> =>{
    
    const count=parseInt(req.params.count);

    try {

       

        const response: QueryResult = await pool.query("SELECT * FROM letter_exersice");
        
        return  res.status(200).json(response.rows);
        
        } catch (error) {
        console.log(error)
       
        return  res.status(500).json('Verificar: '+error);
    }
    
}


//OBTENER VOCALES
export const get_area = async (req: Request, res: Response): Promise <Response> =>{
    
    const count=parseInt(req.params.count);

    try {
        const response: QueryResult = await pool.query("SELECT * FROM area");
        
        return  res.status(200).json(response.rows);
        
        } catch (error) {
        console.log(error)
       
        return  res.status(500).json('Verificar: '+error);
    }
    
}


//crear tarea
export const createTask = async (req: Request, res: Response): Promise <Response> =>{
   
    const {type_text_id,profesor_id,task_text,leter_id,image,type, sound_text,syllable_word_id} = req.body;

   console.log(type_text_id,profesor_id,task_text,leter_id,image,type,sound_text,syllable_word_id);    
   await pool.query('delete from letter_exersice'); 
   
   const response: QueryResult=await pool.query('insert into letter_exersice (profesor_id,task_text,leter_id,image,type,sound_text,syllable_word_id) VALUES ($1, $2, $3, $4, $5, $6, $7 )',[profesor_id,task_text,leter_id,image,type,sound_text,syllable_word_id]);
   
  return  res.json({
       message : 'Category created successfully',
   
        /*body:{                                     
         task_text,
         leter_id,
         image,
         type      
             }*/
     }

    )
     
}

export const create_user = async (req: Request, res: Response): Promise <Response> =>{
     

    const {nombres,apellidos,rol_name,user_name,pass,area_id,profesor_id} = req.body;

    console.log("Nombres ",nombres);
    console.log("Apellidos ",apellidos);
    
    console.log("Usuario ",user_name);
    console.log("Password ",pass);  

    console.log("Rol ",rol_name);
    console.log("Id area ",area_id);
    console.log("Profesor id",profesor_id);
    
   let now= new Date();
  
   
 
   
   try {
    await pool.query('BEGIN') 
   
       if(rol_name == 'p')
       {
         const response: QueryResult=await pool.query('insert into multiple_rol(nombres, apellidos,rol_name) VALUES ($1,$2,$3) returning user_rol_id',[nombres,apellidos,rol_name]); 
         const {user_rol_id} = response.rows[0];    
         await pool.query('insert into users(user_name,pass,user_rol_id) VALUES ($1, $2, $3)',[user_name,pass,user_rol_id]);   
         
         await pool.query('insert into teachers_students(profesor_id,area_id) VALUES ($1, $2)',[user_rol_id,area_id]);   
          
       }

       if(rol_name == 'c')
       {
         const response: QueryResult=await pool.query('insert into multiple_rol(nombres, apellidos,rol_name) VALUES ($1,$2,$3) returning user_rol_id',[nombres,apellidos,rol_name]); 
         const {user_rol_id} = response.rows[0];    
         await pool.query('insert into users(user_name,pass,user_rol_id) VALUES ($1, $2, $3)',[user_name,pass,user_rol_id]);   
         
         await pool.query('insert into teachers_students(coordinator_id,area_id) VALUES ($1, $2)',[user_rol_id,area_id]);   
       }
         
      if(rol_name == 'a')
       {
         const response: QueryResult=await pool.query('insert into multiple_rol(nombres, apellidos,rol_name) VALUES ($1,$2,$3) returning user_rol_id',[nombres,apellidos,rol_name]); 
         const {user_rol_id} = response.rows[0];    
         await pool.query('insert into users(user_name,pass,user_rol_id) VALUES ($1, $2, $3)',[user_name,pass,user_rol_id]);   
         
         await pool.query('insert into teachers_students(profesor_id,student_id,area_id) VALUES ($1, $2, $3)',[profesor_id,user_rol_id,area_id]);   
       }
         

          await pool.query('COMMIT');
     
    
        
     return  res.json({
         message : "creado",        
             
      }
      )

    
   } catch (error) {
    await pool.query('ROLLBACK');
  
     return res.json(' Verificar: '+error);
   }
   
    // return res.json(' Verificar: ');

}


export const create_task_lesson = async (req: Request, res: Response): Promise <Response> =>{
     

    const {word_text,image_text,type} = req.body;

    console.log("word_text ",word_text);
    console.log("mage_text ",image_text);
    
    console.log("type ",type);
   
    
   let now= new Date();
  
   
 
   
   try {
    await pool.query('BEGIN') 
   
       
         const response: QueryResult=await pool.query('insert into syllable_word(word_text,image_text,type,enable) VALUES ($1,$2,$3,$4)',[word_text,image_text,type,true]); 
       

          await pool.query('COMMIT');
     
    
        
     return  res.json({
         message : "creado",        
             
      }
      )

    
   } catch (error) {
    await pool.query('ROLLBACK');
  
     return res.json(' Verificar: '+error);
   }
   
    // return res.json(' Verificar: ');

}

//crear tarea
export const save_sutudent_task = async (req: Request, res: Response): Promise <Response> =>{
   
    const {profesor_id,student_id,syllable_word_id,type} = req.body;

    console.log(profesor_id,student_id,syllable_word_id,type);

   //await pool.query('delete from letter_exersice'); 
   
   /*if(type == 'v')
   {
    const response: QueryResult=await pool.query('insert into student_repetitions (teacher_id,student_id,letter_id,type) VALUES ($1, $2, $3, $4)',[teacher_id,student_id,typetext_id,'v']);
   }
   
   if(type == 'c')
    {
     const response: QueryResult=await pool.query('insert into student_repetitions (teacher_id,student_id,letter_id,type) VALUES ($1, $2, $3, $4)',[teacher_id,student_id,typetext_id,'c']);
    }*/

    
    if(type == 's')
        {
         const response: QueryResult=await pool.query('insert into student_details(syllable_word_score, teacher_id,student_id,syllable_word_id,type) VALUES ($1, $2, $3, $4, $5)',[1,profesor_id,student_id,syllable_word_id,'s']);
        }
    

    if(type == 'w')
        {
         const response: QueryResult=await pool.query('insert into student_details(syllable_word_score, teacher_id,student_id,syllable_word_id,type) VALUES ($1, $2, $3, $4, $5)',[1,profesor_id,student_id,syllable_word_id,'w']);
        }

          if(type == 'p')
        {
         const response: QueryResult=await pool.query('insert into student_details(syllable_word_score, teacher_id,student_id,syllable_word_id,type) VALUES ($1, $2, $3, $4, $5)',[1,profesor_id,student_id,syllable_word_id,'p']);
        }

  return  res.json({
       message : 'Category created successfully',
   
        /*body:{                                     
         task_text,
         leter_id,
         image,
         type      
             }*/
     }

    )
     
}

/*export const createStudentTask = async (req: Request, res: Response): Promise <Response> =>{
   
    const {profesor_id,task_text,leter_id,image,type, sound_text} = req.body;

   console.log(profesor_id,task_text,leter_id,image,type,sound_text);    
   await pool.query('delete from letter_exersice'); 
   
   const response: QueryResult=await pool.query('insert into student_repetitions (profesor_id,task_text,leter_id,image,type,sound_text) VALUES ($1, $2, $3, $4, $5, $6 )',[profesor_id,task_text,leter_id,image,type,sound_text]);
   
  return  res.json({
       message : 'Category created successfully',
   

     }

    )
     
}*/


/**ENDPOINT QUE TODAVÍA NO SE PRUEBA */
export const get_profesor_area = async (req: Request, res: Response): Promise <Response> =>{
 
       //const {area_id} = req.body;
    const area_id=Number(req.params.area_id);
    console.log(area_id);

    const response: QueryResult = await pool.query("SELECT m.user_rol_id, m.nombres, m.apellidos FROM multiple_rol m inner join teachers_students t on m.user_rol_id = t.profesor_id and m.rol_name = 'p' and t.student_id IS NULL and t.area_id = $1 ",[area_id]);       
   
    return  res.status(200).json(response.rows);    
}




 /*ejemplo de transaccion*/ 

 export const ejemplo = async (req: Request, res: Response): Promise <Response> =>{
    

        const {name,description} = req.body;
        
 const client = await pool.connect();

/* try {*/
   //await client.query('BEGIN')
   try {

            
    await client.query('BEGIN') 

    const response: QueryResult=await client.query('insert into category (name) VALUES ($1)',[name]);
    //res.send('recived')
 

     const response2: QueryResult=await client.query('insert into gallerys (src_image) VALUES ($1)',[name]);
     //res.send('recived')
    
     await client.query('COMMIT');
     return  res.json({
         message : 'Category created successfully',
     
          body:{                                      
           name
          }
          
      }
      )

    
   } catch (error) {
     //await client.query('ROLLBACK')
     return res.json('Verificar: '+error);
   }


    }

/**/




export const get_students = async (req: Request, res: Response): Promise <Response> =>{
    
    console.log("está llegando ");
         //const { profesor_id } = req.body[0]
    
         const profesor_id =Number(req.params.profesor_id);

    /*OBTENEMOS LA CANTIDAD DE REGISTROS QUE HAY EN LA TABLA CATEGORÍA*/ 
         console.log(profesor_id);
    
    try {
        
         const response: QueryResult = await pool.query("SELECT m.user_rol_id, m.nombres, m.apellidos FROM multiple_rol m inner join teachers_students t on m.user_rol_id = t.student_id where m.rol_name = 'a' and t.profesor_id = $1 ",[profesor_id]);       
         
        // const response: QueryResult = await pool.query("SELECT m.user_rol_id, m.nombres, m.apellidos FROM multiple_rol m inner join teachers_students t on m.user_rol_id = t.profesor_id and m.rol_name = 'p' and t.student_id IS NOT NULL",[area_id]);       
   
    
   
        return  res.status(200).json(response.rows);
      
    } catch (error) {
        console.log(error)
        return  res.status(500).json('Internal server error');
    }
    
}

export const get_detalles_tareas = async (req: Request, res: Response): Promise <Response> =>{
    
    const student_id =Number(req.params.student_id);
    const profesor_id = Number(req.params.profesor_id);
    console.log("está accediendo, este es el parametro de estudiante ",student_id," y profesror ",profesor_id);

    try {
        const response: QueryResult = await pool.query("SELECT  s.word_text, s.type FROM student_details stu inner join syllable_word s on stu.syllable_word_id = s.syllable_word_id where stu.student_id = $1 and stu.teacher_id = $2 ",[student_id,profesor_id]);
        
        return  res.status(200).json(response.rows);
        
        } catch (error) {
        console.log(error)
       
        return  res.status(500).json('Verificar: '+error);
    }
    
}


 export const deletetareas = async (req: Request, res: Response): Promise <Response> => {
    
        const profesor_id=parseInt(req.params.profesor_id);
        console.log("profesor ",profesor_id);
       
        await pool.query('DELETE FROM student_details where teacher_id = $1',[profesor_id]);
       
       return res.json(' Category deleted successfully');
 }

 export const disablelesson = async (req: Request, res: Response): Promise <Response> => {
    
        const syllable_word_id=parseInt(req.params.syllable_word_id);
        console.log("profesor ",syllable_word_id);
       
        await pool.query('delete from syllable_word where syllable_word_id = $1',[syllable_word_id]);

         await pool.query('delete from student_details where syllable_word_id = $1',[syllable_word_id]);
       
       return res.json(' Category deleted successfully');
 }


export const test = async (req: Request, res: Response): Promise <Response> =>{
    console.log("Hola estoy respondiendo correctamente");

      const result = await pool.query('SELECT NOW()');
     return res.json(result.rows[0]);
    //return res.status(500).json('Hola');
    
}