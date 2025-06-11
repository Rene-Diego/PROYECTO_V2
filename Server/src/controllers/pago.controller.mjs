// este controlador obtiene los datos que te envia el cliente 
// asi como los datos o las funciones para regresarle informacion
//librerias
import express from "express";

//manejador de base de datos o archivo que se encarga de comunicarse con la base de datos
import ClienteService from "../services/cliente.service.mjs"; 
import AutoService from '../services/auto.service.mjs';
import servicioService from '../services/servicio.service.mjs';
import PagoService from '../services/pago.service.mjs';

const router = express.Router();

function obtenerPAGO(req, res, next) {
    PagoService.obtenerPagos()
      .then((registros) => res.json(registros))
      .catch((err) => next(err));
  }

  async function crearPAGO(req, res, next) {
    try {
        const { id_Estacionamiento,cantidad,Tipo_Pago,Fecha,Hora} = req.body;

        await PagoService.AgregarPago(
            id_Estacionamiento,
            cantidad || null,
            Tipo_Pago || null,
            Fecha || null,
            Hora || null
        );

        res.status(201).json({ mensaje: "Pago registrado correctamente" });
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
            Hora_Salida: registro.Hora_Salida
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



router.post("/", crearPAGO);
router.get("/", obtenerPAGO);
//router.get("/:id_Estacionamiento", buscarSERVICIO);
//router.put("/",editarHORA);


export default router;