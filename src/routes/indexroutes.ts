import {Router} from 'express';
import multer from '../libs/multer';
import validatetoken from './validate-token';
const router = Router();


/**IMPORTAMOS LOS METODOS */
import {ejemplo,/*createGalleryelement,*/
        test,
        getVowels,getConsonants,
        getSyllable_word,
        getSyllable,
        createTask,
        get_task,
        get_area,
      
        create_task_lesson,
        save_sutudent_task,
        get_profesor_area,
        getphrase,
        get_detalles_tareas,
        get_students,
        create_user,
        deletetareas,
        disablelesson
        
       } from '../controllers/index.controller'

       import{
    
         get_autentication,
         //get_autentication_profesor    
       } from '../controllers/index.admincontroller'

      
/**CONTROLADORES PARA CLIENTE DE ADMINISTRADOR 
 * _________________________________________________________________________________
 * _________________________________________________________________________________
*/

/**TEST */
router.get('/test',test);

/**INICIO DE QUERIES CONALFA
 * 
*/

/**OBTENER VOCALES */
router.get('/vocal',getVowels);

/**OBTENER CONSONANTES */
router.get('/consonant',getConsonants);

/**OBTENER SILABAS */
router.get('/syllable',getSyllable);


/**OBTENER PALABRAS */
router.get('/word',getSyllable_word);

/**OBTENER FRASES */
router.get('/phrase',getphrase);



/**OBTENER TAREA */
router.get('/gettask',get_task);

router.get('/savestudenttask',);

/**OBTENER TAREA */
router.get('/getarea',get_area);

/**OBTENER DETALLES DE TAREAS REALIZADAS*/
router.get('/get_tasks_details',get_detalles_tareas);


/**OBTENER ESTUDIANTES*/
router.get('/get_students/:profesor_id',get_students);


/**OBTENER PROFESORES DE UN AREA */
router.get('/getprofesors/:area_id',get_profesor_area);



/**OBTENER PROFESORES DE UN AREA */
router.get('/detalletarea/:student_id/:profesor_id',get_detalles_tareas);




/*________________________________________________________________________
__________________________________________________________________________ */
router.post('/createtask',createTask);
             
router.post('/createtasklesson',create_task_lesson)

/*registrar la tarea del usuario*/
router.post('/savestudenttask',save_sutudent_task);


router.post('/createuser',create_user);

router.delete('/trans',ejemplo);

//ELIMINAR TAREA
router.delete('/deletetareas/:profesor_id',deletetareas);


router.delete('/disablelesson/:syllable_word_id',disablelesson);


/**ADIMINISTRACION DE LA APP, COMO AUTENTICACION
 * ______________________________________________
 * ______________________________________________
 */
//router.post('/addUser',addUser);

router.post('/admin/user',get_autentication);



export default router;
