import "rootpath";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import path from "path";

// Archivos de configuración propios
import config from "./middlewares/config.mjs";
import errorHandler from "./middlewares/error-handler.mjs";

// archivos que procesan las entidades (tablas) del proyecto
import EstacionamientoController from "./controllers/cliente.controller.mjs";
import UsuarioController from "./controllers/usuario.controller.mjs";
import CajonController from "./controllers/cajon.controller.mjs";
import ServicioController from "./controllers/servicio.controller.mjs";
import PagoController from "./controllers/pago.controller.mjs";

// Se instancia el servidor
const app = express();

// Librería en tiempo de desarrollo para poder ver el tipo de petición que te están mandando
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false })); // Decodifica los JSON que envía el cliente
app.use(bodyParser.json()); // Decodifica los JSON que envía el cliente
app.use(cors()); // Evita que tengas el error de no poder conectarte a tu mismo servidor

// Se establecen tus rutas o tus APIs o tus endpoints
app.use("/usuario", UsuarioController);
app.use("/cliente", EstacionamientoController);
app.use("/cajon", CajonController);
app.use("/servicio", ServicioController);
app.use("/pago", PagoController);
// Servir archivos estáticos desde la carpeta frontend
app.use(express.static(path.join(process.cwd(), "frontend")));

// Servir index.html por defecto
app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "frontend", "index.html"));
});

app.use(errorHandler);

// Inicia el servidor
app.listen(config.PORT, function () {
  console.log(`Servidor corriendo en http://localhost:${config.PORT}`);
});