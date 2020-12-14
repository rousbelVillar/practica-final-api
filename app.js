const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const uri = 'mongodb+srv://rvillar:Kim5913137@rousbelcluster.i9n75.mongodb.net/PracticaFinal?retryWrites=true&w=majority';
const users = 'Users';
const menu = 'Menu';
const practicaFinal = 'PracticaFinal';
const generalQueryUsers = '/apiPracticaFinal/generalQuery';
const generalQueryMenu = '/apiPracticaFinal/generalQueryMenu';
const insertUser = '/apiPracticaFinal/insertUser';
const insertMenu = '/apiPracticaFinal/insertMenu';
const updateUser = '/apiPracticaFinal/updateUser';
const deleteUser = '/apiPracticaFinal/deleteUser';
const cors = require('cors');
const app = express();
let port = process.env.PORT;

if (port == null || port == '') {
  port = 8000;
}

app.use(cors());

app.get('/' , (req , res)=>{;
    res.send('Home')
});

app.use(express.json())

app.listen(port ,()=>{
    console.log('listening to port:' + port)
});

//Query para usuarios
app.get(generalQueryUsers,(req,res)=>{
    const queryObj = {
        res : res,
        req : req,
        collection : users,
    }
    queryGeneral(queryObj)
});

//Query para menus
app.get(generalQueryMenu,(req,res)=>{
    const queryObj = {
        res : res,
        req : req,
        collection : menu,
    }
    queryGeneral(queryObj)
});

//Insertar documento usuario
app.post(insertUser,(req,res)=>{
    const queryObj = {
        res : res,
        req : req,
        collection : users,
    }
    insertDocument(queryObj)
});

//Insertar documento menu
app.post(insertMenu,(req,res)=>{
    const queryObj = {
        res : res,
        req : req,
        collection : menu,
    }
    insertDocument(queryObj)
});

//Actualiar un usuario
app.put(updateUser,(req,res)=>{
    const client = new MongoClient(uri, { useNewUrlParser: true });
    const query = {cedula: req.body.cedula};
    const newQuery = { $set: { 
            name: req.body.name,
            last_name: req.body.last_name,
            workplace: req.body.workplace,
            job_position: req.body.job_position,
            phones: [req.body.phones],
            emails: [req.body.emails],
            role: req.body.role,
        }
    }
    client.connect(err=>{
    checkForError(err,'Conexion Exitosa!');
    const collection = client.db(practicaFinal).collection(users);
    collection.updateOne(query,newQuery,(error,result)=>{
            checkForError(error,'Documento Actualizado');
            res.status(200).send(result);
        });
        client.close();
    })
})

//Borrar usuario
app.post(deleteUser,(req,res)=>{
    const client = new MongoClient(uri, { useNewUrlParser: true });
    const query = {cedula: req.body.cedula};
    client.connect(err => {  
    checkForError(err,'Conexion Exitosa!')
    const collection = client.db(practicaFinal).collection(users);
    collection.deleteOne(query,(error,result)=>{
            checkForError(error,'Documento Borrado')
            res.status(200).send(result.insertedId);
        });
        client.close();
    });
});


function checkForError(err,successMessage){
    if(err){
        throw err;
    }
    console.log(successMessage);   
}

function queryGeneral(queryObj){
  const client = new MongoClient(uri, { useNewUrlParser: true });
  const query = queryObj.req.query;
  client.connect(err => {
    checkForError(err,'Conexion Exitosa!');
    const collection = client.db(practicaFinal).collection(queryObj.collection);
        collection.find(query).toArray((error,documents)=>{
            checkForError(error,'Se han devuelto todos los documentos con coincidencias.')
            queryObj.res.status(200).send(JSON.stringify(documents));
        })
      client.close(); 
    });
}

function insertDocument(insertObj){
    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {  
    checkForError(err,'Conexion Exitosa!')
    const collection = client.db(practicaFinal).collection(insertObj.collection);
    collection.insertOne(insertObj.req.body,(error,result)=>{
            checkForError(error,'Documento Agregado')
            insertObj.res.status(200).send(result.ops[0]);
        });
        client.close();
    });
}

