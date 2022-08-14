import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import handlerErrorWithPrisma from './handlerErrors.js';
import amqplib from 'amqplib';
const queue = 'solicitudes';

// Objeto con todas las funciones
const controllers = {};

//  SOLICITAR ACCESO A UN HISTORIAL
    controllers.requestAccessToHistory = async (req, res) => {
        try {
            const {
                medicoId,
                pacienteDni
            } = req.body;
            //  Validar existencia del medico
            const medico = await prisma.medico.findUnique({ where: { id: Number(medicoId) } });
            if (!medico) {
                res.json({ message: "Medico no existe" });
            } else {
                //  Enviar mensaje de solicitud de acceso a historial a rabbitMQ
                const conn = await amqplib.connect(process.env.QUEUE_KEY);

                const ch = await conn.createChannel();
                await ch.assertQueue(queue);

                await ch.sendToQueue(queue, Buffer.from(JSON.stringify({
                    medicoId,
                    institucionId: medico.institucionId,
                    pacienteDni
                })));
                res.json({ message: "Success", detail: "Solicitud enviada" });
            }
        } catch (error) {
            res.json(handlerErrorWithPrisma(error));
        }
    }

//  INSTITUCIONES
    //  Crear institución
    controllers.createInstitution = async (req, res) => {
        try {
            const {
                nombre,
                departamento,
                provincia,
                distrito,
                direccion,
                categoria,
                fechaRegistro
            } = req.body;
            const institucion = await prisma.institucion.create({
                data: {
                    nombre,
                    departamento,
                    provincia,
                    distrito,
                    direccion,
                    categoria,
                    fechaRegistro: new Date(fechaRegistro)
                }
            });
            res.json({ message: "Success", institucion });
        } catch (error) {
            res.json(handlerErrorWithPrisma(error));
        };
    };

    //  Obtener instituciones
    controllers.getInstitutions = async (req, res) => {
        try {
            const instituciones = await prisma.institucion.findMany();
            res.json({ message: "Success", instituciones });
        } catch (error) {
            res.json(handlerErrorWithPrisma(error));
        };
    };

    //  Obtener institución por id
    controllers.getInstitutionById = async (req, res) => {
        try {
            const { id } = req.query;
            const institucion = await prisma.institucion.findUnique({
                where: { id: Number(id) }
            });
            res.json({ message: "Success", institucion });
        } catch (error) {
            res.json(handlerErrorWithPrisma(error));
        };
    };

    //  Actualizar institución
    controllers.updateInstitution = async (req, res) => {
        try {
            const {
                id,
                nombre,
                departamento,
                provincia,
                distrito,
                direccion,
                categoria,
                fechaRegistro
            } = req.body;
            const institucion = await prisma.institucion.update({
                where: { id: Number(id) },
                data: {
                    nombre,
                    departamento,
                    provincia,
                    distrito,
                    direccion,
                    categoria,
                    fechaRegistro: new Date(fechaRegistro)
                }
            });
            res.json({ message: "Success", institucion });
        } catch (error) {
            res.json(handlerErrorWithPrisma(error));
        };
    };

    //  Eliminar institución
    controllers.deleteInstitution = async (req, res) => {
        try {
            const { id } = req.query;
            const institucion = await prisma.institucion.delete({
                where: { id: Number(id) }
            });
            res.json({ message: "Success", institucion });
        } catch (error) {
            res.json(handlerErrorWithPrisma(error));
        };
    };

//  MÉDICOS
    //  Crear medico
    controllers.createMedico = async (req, res) => {
        try {
            const {
                dni,
                apellidos,
                nombre,
                sexo,
                institucionId,
                areaId,
                especialidadId,
                telefono
            } = req.body;
            const medico = await prisma.medico.create({
                data: {
                    dni,
                    apellidos,
                    nombre,
                    sexo,
                    institucionId: Number(institucionId),
                    areaId: Number(areaId),
                    especialidadId: Number(especialidadId),
                    telefono
                }
            });
            res.json({ message: "Success", medico });
        } catch (error) {
            res.json(handlerErrorWithPrisma(error));
        };
    };

    //  Obtener medicos
    controllers.getMedicos = async (req, res) => {
        try {
            const medicos = await prisma.medico.findMany();
            res.json({ message: "Success", medicos });
        } catch (error) {
            res.json(handlerErrorWithPrisma(error));
        };
    };

    //  Obtener medico por id
    controllers.getMedicoById = async (req, res) => {
        try {
            const { id } = req.query;
            const medico = await prisma.medico.findUnique({
                where: { id: Number(id) },
                include: {
                    institucion: true,
                    area: true,
                    especialidad: true
                }
            });
            res.json({ message: "Success", medico });
        } catch (error) {
            res.json(handlerErrorWithPrisma(error));
        };
    };

    //  Actualizar medico
    controllers.updateMedico = async (req, res) => {
        try {
            const {
                id,
                dni,
                apellidos,
                nombre,
                sexo,
                institucionId,
                areaId,
                especialidadId,
                telefono
            } = req.body;
            const medico = await prisma.medico.update({
                where: { id: Number(id) },
                data: {
                    dni,
                    apellidos,
                    nombre,
                    sexo,
                    institucionId: Number(institucionId),
                    areaId: Number(areaId),
                    especialidadId: Number(especialidadId),
                    telefono
                }
            });
            res.json({ message: "Success", medico });
        } catch (error) {
            res.json(handlerErrorWithPrisma(error));
        };
    };

    //  Eliminar medico
    controllers.deleteMedico = async (req, res) => {
        try {
            const { id } = req.query;
            const medico = await prisma.medico.delete({
                where: { id: Number(id) }
            });
            res.json({ message: "Success", medico });
        } catch (error) {
            res.json(handlerErrorWithPrisma(error));
        };
    };

//  ÁREAS
    //  Crear area
    controllers.createArea = async (req, res) => {
        try {
            const { nombre } = req.body;
            const area = await prisma.area.create({
                data: {
                    nombre
                }
            });
            res.json({ message: "Success", area });
        } catch (error) {
            res.json(handlerErrorWithPrisma(error));
        };
    };

    //  Obtener areas
    controllers.getAreas = async (req, res) => {
        try {
            const areas = await prisma.area.findMany();
            res.json({ message: "Success", areas });
        } catch (error) {
            res.json(handlerErrorWithPrisma(error));
        };
    };

    //  Eliminar area
    controllers.deleteArea = async (req, res) => {
        try {
            const { id } = req.query;
            const area = await prisma.area.delete({
                where: { id: Number(id) }
            });
            res.json({ message: "Success", area });
        } catch (error) {
            res.json(handlerErrorWithPrisma(error));
        };
    };

//  ESPECIALIDADES
//  Crear especialidad
    controllers.createEsp = async (req, res) => {
        try {
            const { nombre } = req.body;
            const especialidad = await prisma.especialidad.create({
                data: {
                    nombre
                }
            });
            res.json({ message: "Success", especialidad });
        } catch (error) {
            res.json(handlerErrorWithPrisma(error));
        };
    };

    //  Obtener especialidades
    controllers.getEsp = async (req, res) => {
        try {
            const especialidades = await prisma.especialidad.findMany();
            res.json({ message: "Success", especialidades });
        } catch (error) {
            res.json(handlerErrorWithPrisma(error));
        };
    };

    //  Eliminar especialidad
    controllers.deleteEsp = async (req, res) => {
        try {
            const { id } = req.query;
            const especialidad = await prisma.especialidad.delete({
                where: { id: Number(id) }
            });
            res.json({ message: "Success", especialidad });
        } catch (error) {
            res.json(handlerErrorWithPrisma(error));
        };
    };

export default controllers;