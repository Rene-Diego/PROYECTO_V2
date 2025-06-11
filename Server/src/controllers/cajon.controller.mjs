// este controlador obtiene los datos que te envia el cliente 
// asi como los datos o las funciones para regresarle informacion
//librerias
import express from "express";

//manejador de base de datos o archivo que se encarga de comunicarse con la base de datos
import CajonService from "../services/cajon.service.mjs";

const router = express.Router();

//req - de aqui obtienes las parametros que te envia el usuario
//res - aqui se encuentran los metodos para regresar infromacion o responder
//next - llama el siguiente proceso, aqui se usa para devolver errores y pasarselos a error handler
function obtenerRegistrosCajon(req, res, next) {
    CajonService.obtenerCajon()
      .then((registros) => res.json(registros))
      .catch((err) => next(err));
  }
  function crearRegistrosCajon(req, res, next) {
    const { Estado, Tipo, Tamaño} = req.body;
    CajonService.crearCajon({Estado, Tipo, Tamaño})
      .then(() => {
        res.status(201).json({ mensaje: "Cajon registrado correctamente" });
      })
      .catch((err) => next(err));
  }
  
  function eliminarRegistrosCajon(req, res, next) {
      const { id_Cajon } = req.params;
  
      CajonService.eliminarCajon(id_Cajon)
          .then(() => {
              res.status(200).json({ mensaje: "Cajon eliminado correctamente." });
          })
          .catch((err) => next(err));
  }


function editarReguistroCajon(req, res, next) {
    const { id_Cajon, Estado } = req.body;

    CajonService.editarCajon(id_Cajon, Estado)
        .then(() => {
            res.status(200).json({ mensaje: "Estado editado correctamente." });
        })
        .catch((err) => next(err));
}


function editarReguistroCajonTodo(req, res, next) {
    const { id_Cajon, Estado,Tamaño,Tipo } = req.body;

    CajonService.editarCajonTodo(id_Cajon, Estado,Tamaño,Tipo)
        .then(() => {
            res.status(200).json({ mensaje: "Cajon editado correctamente." });
        })
        .catch((err) => next(err));
}

router.get("/", obtenerRegistrosCajon);
router.post("/", crearRegistrosCajon);
router.delete("/:id_Cajon", eliminarRegistrosCajon);
router.put("/",editarReguistroCajon)
router.put("/:id_Cajon", editarReguistroCajonTodo);



export default router;