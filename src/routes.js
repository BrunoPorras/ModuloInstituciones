import express from 'express';
import controllers from './controllers.js';
const router = express.Router();

//  ACCESO A HISTORIAL
    router.post('/requestAccessToHistory', controllers.requestAccessToHistory);

//  INSTITUCIONES
    //  Crear institución
    router.post('/create', controllers.createInstitution);

    //  Obtener instituciones
    router.get('/getAll', controllers.getInstitutions);

    //  Obtener institución por id
    router.get('/getOne', controllers.getInstitutionById);

    //  Actualizar institución
    router.put('/update', controllers.updateInstitution);

    //  Eliminar institución
    router.delete('/delete', controllers.deleteInstitution);

//  MÉDICOS
    //  Obtener medicos
    router.get('/getAllMedicos', controllers.getMedicos);

    //  Obtener medico por id
    router.get('/getOneMedico', controllers.getMedicoById);

    //  Crear medico
    router.post('/createMedico', controllers.createMedico);

    //  Actualizar medico
    router.put('/updateMedico', controllers.updateMedico);

    //  Eliminar medico
    router.delete('/deleteMedico', controllers.deleteMedico);

//  ÁREAS
    //  Obtener areas
    router.get('/getAllAreas', controllers.getAreas);

    //  Crear medico
    router.post('/createArea', controllers.createArea);

    //  Eliminar medico
    router.delete('/deleteArea', controllers.deleteArea);

//  ESPECIALIDADES
    //  Obtener areas
    router.get('/getAllEsp', controllers.getEsp);

    //  Crear medico
    router.post('/createEsp', controllers.createEsp);

    //  Eliminar medico
    router.delete('/deleteEsp', controllers.deleteEsp);

export default router;