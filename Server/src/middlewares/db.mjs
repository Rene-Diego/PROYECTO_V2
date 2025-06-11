// aqui se realiza la conexion
// libreria
import mysql from "mysql2/promise";

async function connect() {
    try {
        const connection = await mysql.createConnection({
            host: "18.117.135.191",
            user: "EquipoRene",
            password: "18100qAb*",
            database: "Estacionamiento",
            charset: "utf8mb4"
        });
        console.log("Conexión a la base de datos establecida correctamente.");

        return connection;
    } catch (error) {
        console.error("Error al conectar a la base de datos:", error.message);
        throw error;
    }
}

export default connect;
