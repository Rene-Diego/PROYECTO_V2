// este controlador obtiene los datos que te envia el cliente 
// asi como los datos o las funciones para regresarle informacion
//librerias
import express from "express";

//manejador de base de datos o archivo que se encarga de comunicarse con la base de datos
import ClienteService from "../services/cliente.service.mjs"; 
import AutoService from '../services/auto.service.mjs';
const router = express.Router();

//req - de aqui obtienes las parametros que te envia el usuario
//res - aqui se encuentran los metodos para regresar infromacion o responder
//next - llama el siguiente proceso, aqui se usa para devolver errores y pasarselos a error handler

function obtenerRegistrosCliente(req, res, next) {
    Promise.all([ClienteService.obtenerRegistros(), AutoService.obtenerRegistrosA()])
        .then(([clientes, autos]) => {
            // Asociamos cada auto al cliente correspondiente
            const clientesConAutos = clientes.map(cliente => {
                return {
                    ...cliente,
                    autos: autos.filter(auto => auto.id_cliente === cliente.id_cliente) // Asegurar coincidencia de ID
                };
            });

            res.json(clientesConAutos);
        })
        .catch((err) => next(err));
}


function crearRegistrosCliente(req, res, next) {
    const { Nombre, Telefono, Placa, Marca, Color, Tipo } = req.body;

    // Primero, crear el cliente
    ClienteService.crearCliente(Nombre, Telefono)
        .then((nuevoCliente) => {
            if (!nuevoCliente || !nuevoCliente.id) {
                throw new Error("No se pudo obtener el ID del cliente.");
            }

            // Luego, crear el registro del auto con el ID del cliente recién creado
            return AutoService.crearRegistroA({
                Placa,
                Marca,
                Color,
                Tipo,
                id_cliente: nuevoCliente.id
            }).then(() => nuevoCliente.id); // Retornar el ID del cliente después de registrar el auto
        })
        .then((clienteId) => {
            res.status(201).json({
                mensaje: "Cliente y auto registrados correctamente.",
                clienteId
            });
        })
        .catch((err) => next(err));
}

function editarRegistrosCliente(req, res, next) {
    const { id_cliente, Nombre, Telefono, Placa, Marca, Color, Tipo } = req.body;

    Promise.all([
        ClienteService.editarCliente(id_cliente, Nombre, Telefono),
        AutoService.editarAuto(Placa, Marca, Color, Tipo, id_cliente)
    ])
    .then(() => {
        res.status(200).json({ mensaje: "Cliente  y auto editado correctamente." });
    })
    .catch((err) => next(err));
}

function eliminarRegistrosCliente(req, res, next) {
    const { id_cliente, Nombre } = req.params;

    Promise.all([
        ClienteService.eliminarCliente(id_cliente),
        AutoService.eliminarRegistroA(id_cliente)
    ])
    .then(() => {
        res.status(200).json({ mensaje: "Cliente eliminado correctamente." });
    })
    .catch((err) => next(err));
}


function buscarCliente(req, res, next) {
    const { id_cliente } = req.params; // Obtener el ID desde la URL

    Promise.all([
        ClienteService.obtenerCliente(id_cliente),
        AutoService.obtenerAuto(id_cliente)
    ])
    .then(([cliente, auto]) => {
        if (!cliente) {
            return res.status(404).json({ mensaje: "Cliente no encontrado" });
        }

        if (!auto) {
            return res.status(404).json({ mensaje: "Auto no encontrado para este cliente" });
        }

        // Solo enviamos los datos requeridos
        res.json({
            Nombre: cliente.Nombre,
            Telefono: cliente.Telefono,
            id_Auto: auto.id_Auto,
            Placa: auto.Placa,
            Marca: auto.Marca,
            Color: auto.Color,
            Tipo: auto.Tipo
        });
    })
    .catch((err) => next(err));
}

router.get("/", obtenerRegistrosCliente);
router.post("/", crearRegistrosCliente);
router.put("/", editarRegistrosCliente);
router.delete("/:id_cliente", eliminarRegistrosCliente);
router.get("/:id_cliente", buscarCliente);


export default router;