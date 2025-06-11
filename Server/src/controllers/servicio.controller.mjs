// este controlador obtiene los datos que te envia el cliente 
// asi como los datos o las funciones para regresarle informacion
//librerias
import express from "express";

//manejador de base de datos o archivo que se encarga de comunicarse con la base de datos
import ClienteService from "../services/cliente.service.mjs"; 
import AutoService from '../services/auto.service.mjs';
import servicioService from '../services/servicio.service.mjs';
const router = express.Router();

function obtenerRegistrosServicio(req, res, next) {
    servicioService.obtenerServicios()
      .then((registros) => res.json(registros))
      .catch((err) => next(err));
  }


function crearRegistroNC(req, res, next) {
    const { Nombre, Telefono, Placa, Marca, Color, Tipo, id_Cajon, Hora_Entrada, Hora_Salida, Fecha } = req.body;

    ClienteService.crearCliente(Nombre || null, Telefono || null)
        .then((nuevoCliente) => {
            if (!nuevoCliente || !nuevoCliente.id) {
                throw new Error("No se pudo obtener el ID del cliente.");
            }

            return AutoService.crearRegistroA({
                Placa: Placa || null,
                Marca: Marca || null,
                Color: Color || null,
                Tipo: Tipo || null,
                id_cliente: nuevoCliente.id
            });
        })
        .then((nuevoAuto) => {
            if (!nuevoAuto || !nuevoAuto.id) {
                throw new Error("No se pudo obtener el ID del auto.");
            }

            return servicioService.ServicioNC(
                nuevoAuto.id,
                id_Cajon || null,
                Hora_Entrada || null,
                Hora_Salida || null,
                Fecha || null
            );
        })
        .then(() => {
            res.status(201).json({
                mensaje: "Cliente, auto y servicio registrados correctamente."
            });
        })
        .catch((err) => next(err));
}


  async function crearRegistroCR(req, res, next) {
    try {
        const { id_Auto, id_Cajon, Hora_Entrada, Hora_Salida, Fecha } = req.body;

        await servicioService.ServicioNC(
            id_Auto,
            id_Cajon || null,
            Hora_Entrada || null,
            Hora_Salida || null,
            Fecha || null
        );

        res.status(201).json({ mensaje: "Servicio registrado correctamente" });
    } catch (error) {
        next(error);
    }
}

async function buscarSERVICIO(req, res, next) {
    try {
        const { id_Estacionamiento } = req.params; // Obtener el ID desde la URL

        // Obtener el servicio
        const registro = await servicioService.obtenerSERVICIO(id_Estacionamiento);
        if (!registro) {
            return res.status(404).json({ mensaje: "Estacionamiento no encontrado" });
        }

        // Verificar si id_Auto está presente en el registro
        if (!registro.id_Auto) {
            return res.status(404).json({ mensaje: "No se encontró un auto asociado" });
        }

        // Obtener datos del auto
        const auto = await AutoService.obtenerAutoIA(registro.id_Auto);
        if (!auto) {
            return res.status(404).json({ mensaje: "No se encontraron datos del auto" });
        }

        // Enviar la respuesta con los datos requeridos
        res.json({
            id_cliente: auto.id_cliente,
            id_Auto: auto.id_Auto,
            Hora_Entrada: registro.Hora_Entrada,
            Hora_Salida: registro.Hora_Salida,
            id_Cajon:registro.id_Cajon
        });

    } catch (error) {
        next(error);
    }
}

function editarHORA(req, res, next) {
    const { id_Estacionamiento,Hora_Salida } = req.body;

    servicioService.editarHora(id_Estacionamiento,Hora_Salida)
        .then(() => {
            res.status(200).json({ mensaje: "Hora editada correctamente." });
        })
        .catch((err) => next(err));
}



router.post("/", crearRegistroNC);
router.post("/:id_Auto", crearRegistroCR);
router.get("/", obtenerRegistrosServicio);
router.get("/:id_Estacionamiento", buscarSERVICIO);
router.put("/",editarHORA);


export default router;