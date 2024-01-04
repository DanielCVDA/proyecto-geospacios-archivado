const express = require('express');
const router = express.Router();

const pool = require('../database'); 

router.get('/add',(req, res)=>{
    res.render('../views/projects/add');

});

router.post('/add', async (req, res) => {
    const { projectname, number_adv, route } = req.body; // RECUPERA LOS DATOS INGRESADOS POR EL USUARIO Y SE GUARDA EN UN OBJETO
    const newProject = { // OBJETO QUE CONTIENE LOS DATOS A INGRESAR A LA BD
        projectname,
        number_adv,
        route,
        state: false // SIGNIFICA QUE EL ESTADO ESTARÁ ACTIVO
    };
    console.log(newProject); // MUESTRA EN CONSOLA LOS DATOS QUE SE HAN INGRESADO
    await pool.query('INSERT INTO proyecto set ?', [newProject]); // INSERTA EL NUEVO PROYECTO A LA BD
    // req.flash('success', 'proyecto agregado correctamente');
    res.redirect('/projects'); 
});

router.get('/', async(req, res)=>{ // RUTA projects/
    const projects = await pool.query('SELECT * FROM proyecto WHERE state = 1'); // CONSULTA LOS PROYECTOS ACTIVOS 
    res.render('projects/list', {projects}); // MUESTRA EN LA VISTA projects/list LOS PROYECTOS ACTIVOS
});


module.exports = router;