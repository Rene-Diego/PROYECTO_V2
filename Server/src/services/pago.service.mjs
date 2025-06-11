// archivo de configuacion de la base de datos
import connect from "../middlewares/db.mjs";

async function obtenerPagos() {
  //establecemos la conexion a la base de datos
  const db = await connect();

  try{
    //consulta para obtener todos los registros
    const [rows] = await db.execute("SELECT * FROM Pagos"); 
        
    //se retornan los registros
    return Promise.resolve(rows);
  } catch (error) {
    //se muestra el error y se retorna un mensaje de error
    console.log("Error:", error);
    return Promise.reject("Ocurrio un error al intertar obtener los pagos");
  } finally {
    //cerramos la conexion a la base de datos, independientemente de si hubo error o no
    db.end();
  }
}


async function AgregarPago(id_Estacionamiento,cantidad,Tipo_Pago,Fecha,Hora ) {
    // Establecemos la conexión con la base de datos
    const db = await connect();
    try {
        // Consulta para insertar un nuevo registro y obtener el ID generado
        const [result] = await db.execute(
            "INSERT INTO Pagos (id_Estacionamiento,cantidad,Tipo_Pago,Fecha,Hora) VALUES (?, ?, ?, ?, ?)",
            [id_Estacionamiento,cantidad,Tipo_Pago,Fecha,Hora]
        );

        console.log("Pago insertado correctamente");
    } catch (error) {
        // Se muestra el error y se retorna un mensaje de error
        console.error("Error al insertar el registro:", error);
        throw new Error("Error ."); // Propagamos el error para manejarlo en el servicio
    } finally {
        // Cerramos la conexión a la base de datos, independientemente del resultado
        db.end();
    }
}


async function obtenerSERVICIO(id_Estacionamiento) {
  // Establecemos la conexión a la base de datos
  const db = await connect();

  try {
    // Consulta para obtener solo un registro específico
    const [rows] = await db.execute("SELECT * FROM Estacionamiento WHERE id_Estacionamiento = ?", [id_Estacionamiento]);

    // Verificamos si se encontró el usuario
    if (rows.length === 0) {
      return Promise.reject("Estacionamiento no encontrado");
    }

    // Se retorna el usuario encontrado
    return Promise.resolve(rows[0]);
  } catch (error) {
    console.log("Error:", error);
    return Promise.reject("Ocurrió un error al intentar obtener el Estacionamiento");
  } finally {
    // Cerramos la conexión a la base de datos
    db.end();
  }
}

async function editarHora(id_Estacionamiento,Hora_Salida ) {
    // Establecemos la conexión a la base de datos
    const db = await connect();

    try {
        // Ejecutamos la consulta SQL para actualizar todos los campos
        const [result] = await db.execute(
            "UPDATE Estacionamiento SET Hora_Salida = ? WHERE id_Estacionamiento = ?",
            [Hora_Salida, id_Estacionamiento ]
        );

        // Se devuelve el resultado de la operación
        console.log("Editado: ", result);
        return Promise.resolve("OK");
    } catch (error) {
        // Se muestra el error y se retorna un mensaje de error
        console.log("Error:", error);
        return Promise.reject("Ocurrió un error al intentar editar Hora");
    } finally {
        // Cerramos la conexión a la base de datos, independientemente del resultado
        db.end();
    }
}

export default {
   obtenerPagos,
   AgregarPago
  }