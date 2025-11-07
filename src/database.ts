import {Pool} from  "pg";

require('dotenv').config();
 
/*dotenv.config({
    user: process.env.USER,
    host: process.env.HOST,
    password: process.env.PASS,  
    database: process.env.DATABASE,
    port: 5432
});*/


export const pool = new Pool({
    user: 'postgres', 
    host: 'tramway.proxy.rlwy.net',
    password: 'xbMbZeGJHAWbJzvINAmdJLQwsqfMpCoy',
    database: 'railway',
    port: 47828,
    ssl : {
        rejectUnauthorized : false
    }
})

/*export const pool= new Pool({
    user: 'postgres',
    host: 'localhost',
    password: 'Servidora',
    database: 'conalfa_db',
    port: 5432
   
})*/


/*export const pool= new Pool({
    user : 'postgres_user',
    host: 'dpg-coflj5mv3ddc739l1bi0-a',
    password: '9B8xt490yvEi8nuIXmO9yJyeVl8kX0tl',
    database: 'postgres_database_cuvs',
    port: 5432

})*/


