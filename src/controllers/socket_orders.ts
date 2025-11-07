import { QueryResult } from 'pg';
import {pool} from '../database'


export class socket_orders{

  array_product_fields : any = [];

    static async order_createOrderjson(data : any)  {

      /**CODIGO PARA LA ORDEN */
      const short = require('short-uuid');
      const codeseparator = short.uuid().split("-");
      const code = codeseparator[0];
    
      /**FECHA ABREVIADA Y HORA EN FORMATO LATINOAMERICANO */
      const date = new Date();
       const date_spanishformat= date.toLocaleString('es-MX', {
          timeZone: 'America/Guatemala',
          dateStyle: 'medium'/*,
          timeStyle: 'medium',*/
        })
      
      /**FECHA ABREVIADA EN FORMATO INGLES*/
        const date_englishformat= date.toLocaleString('en-US', {
          timeZone: 'America/Guatemala',
          dateStyle: 'medium'
        })
      
        /**FECHA Y HORA EN FORMATO LATINO PERO CON DIAGONAL "2023/5/3" POR ESO SE NECESITA CONVERTIR 
         * PROBABLEMENTE HAYA OTRA FORMA PERO DE MOMENTO NO ENCONTRÉ
        */
         const ordertime = date.toLocaleString('es-MX',{
         timeZone: 'America/Guatemala'
         });
        
         /**EXTRAEMOS HORA Y FECHA CON LA VARIABLE datetime_separator EL CUAL SIRVE PARA TOKENIZAR*/
        
         const datetime_separator = ordertime.split(" ");
         /**EXTRAEMOS LA FECHA*/
         const orderdate = datetime_separator[0];
       
         /**DIVIIMOS AHORA LA FECHA PARA REEPLAZAR LA DIAGONAL POR GUIÓN*/
        const orderdate_separator = orderdate.split("/");
         /**Y LUEGO LE DAMOS FORMATO 01, 02, 03 A LOS VALORES MENORES QUE 10 YA QUE 
          * TIENEN VALOR 1, 2 , 3 EL CUAL NO ES ACEPTADO EN EL FORMATO DE FECHA DE LA DB */   
        
         
           orderdate_separator[2]=""+parseInt(orderdate_separator[2]);
         

         if(parseInt(orderdate_separator[1])  < 10)
        { 

          orderdate_separator[1]="0"+orderdate_separator[1];
        }

        if(parseInt(orderdate_separator[0])  < 10)
        { 
        orderdate_separator[0]="0"+orderdate_separator[0];
        }
        
    const english_date = orderdate_separator[2]+"-"+orderdate_separator[1]+"-"+orderdate_separator[0];
    
    
    
    const products = data.products;
    

    const total =data.total;
    const note = data.note;
    const hour = datetime_separator[1];
   
    const customer_name= data.customer_name;
    const customer_last_name=data.customer_last_name;
    const user_phone = data.phone;
 
  
             /**                               INICIA LA TRANSACCION 
              * ______________________________________________________________________________________
              * ______________________________________________________________________________________
             */
                           
            try { 
              await pool.query('BEGIN');  

              
              const response_idorder : QueryResult =  await pool.query("insert into orders (order_date,order_time,code,order_state,tag,total,order_type,date_spanishformat,date_englishformat) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) returning id_order",[english_date,hour,code,"Procesando",note,total,"extern_nologedin",date_spanishformat,date_englishformat]);                
              const {id_order} = response_idorder.rows[0]
              
            
              const  order_users = await pool.query("insert into orders_extern_users (person_name,person_second_name,user_phone,id_order) VALUES ($1,$2,$3,$4)",[customer_name,customer_last_name,user_phone,id_order]);                
              
              for (let i = 0; i < products.length; i++)
              {  
                
                const response: QueryResult = await pool.query('SELECT name, price FROM product where id_product = $1 ', [products[i].id_product])
                const array_product_fields  = response.rows;                  
              
                const response_id_ordersdetail : QueryResult = await pool.query("insert into orders_detail (dish_name,dish_price,id_product,dishes_number,sub_total,id_order) VALUES ($1,$2,$3,$4,$5,$6) returning id_order_detail ",[array_product_fields[0].name,array_product_fields[0].price, products[i].id_product, products[i].amount ,products[i].sub_total,id_order]);                               
                const id_order_detail = response_id_ordersdetail.rows[0].id_order_detail;
                
                 const add_ons_size= products[i].add_ons.length;
                  
                      for (let j = 0; j < add_ons_size; j++)
                        {
                          await pool.query("insert into extra_orders_detail (extra_name,extra_price,id_order_detail) VALUES ($1,$2,$3)",[products[i].add_ons[j].tag, products[i].add_ons[j].price,id_order_detail]);          
                        }
                 
                }
              
                //console.log("orden 3")
            
              await pool.query('COMMIT'); 
              
             
              return true;

            } catch (error) {
              await pool.query('ROLLBACK'); 
              console.log("hay error"+error);
              return false;
            }
            
               /**
                *                           FIN DE LA TRANSACCION
                * _______________________________________________________________________________
                * _______________________________________________________________________________
                */
    }

}


