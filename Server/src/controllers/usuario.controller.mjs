// este controlador obtiene los resulatados que te envian el cliente
// asi como los datos o funciones

import express from 'express';


import UsuarioService from '../services/usuario.service.mjs';

const router = express.Router();

function login(req, res, next) {
    const { Nick, Password } = req.body;
    UsuarioService.buscarUsuario(Nick, Password)
        .then((resp) => {
            if (resp.length == 1) {
                res.status(200).json({ mensaje: "Acceso concedido", id_usuario: resp[0].id_usuario, Tipo_Usuario: resp[0].Tipo_Usuario });
            } else {
                res.status(400).json({ mensaje: "Usuario o Contraseña incorrecta" });
            }
        })
        .catch((error) => next(error));
}

  
function obtenerRegistros(req, res, next) {
    UsuarioService.obtenerRegistros()
      .then((registros) => res.json(registros))
      .catch((err) => next(err));
  }

function crearRegistros(req, res, next) {
  const { Nick, Correo, Tipo_Usuario, Password } = req.body;

  // Validar que los valores no sean undefined
  if (!Nick || !Correo || !Tipo_Usuario || !Password) {
    return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
  }

  UsuarioService.crearRegistro({ Nick, Correo, Tipo_Usuario, Password })
    .then(() => {
      res.status(201).json({ mensaje: "Usuario registrado correctamente" });
    })
    .catch((err) => next(err));
}

function eliminarRegistros(req, res, next) {
    const { id_usuario, Nick } = req.params;

    UsuarioService.eliminarRegistro(id_usuario, Nick)
        .then(() => {
            res.status(200).json({ mensaje: "Usuario eliminado correctamente." });
        })
        .catch((err) => next(err));
}
function buscarUsuario(req, res, next) {
    const { id_usuario } = req.params; // Obtener el ID desde la URL

    UsuarioService.obtenerUsuario(id_usuario)
      .then((registro) => {
          if (!registro) {
              return res.status(404).json({ mensaje: "Usuario no encontrado" });
          }
          res.json(registro);
      })
      .catch((err) => next(err));
}
function editarUsuario(req, res, next) {
    const { id_usuario, Nick, Correo, Tipo_Usuario, Password } = req.body;

    UsuarioService.editarUsuario(id_usuario, Nick, Correo, Tipo_Usuario, Password)
        .then(() => {
            res.status(200).json({ mensaje: "Cliente editado correctamente." });
        })
        .catch((err) => next(err));
}

    router.get("/", obtenerRegistros);
    router.post("/login", login);
    router.post("/", crearRegistros);
    router.delete("/:id_usuario/:Nick", eliminarRegistros);
    router.get("/:id_usuario", buscarUsuario);
    router.put("/", editarUsuario);
    export default router;