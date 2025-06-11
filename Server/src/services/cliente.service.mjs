// archivo de configuacion de la base de datos
import connect from "../middlewares/db.mjs";

async function obtenerRegistros() {
    // Establecemos la conexión a la base de datos
    const db = await connect();

    try {
        // Consulta para obtener todos los registros
        const [rows] = await db.execute("SELECT * FROM Cliente");

        // Se retornan los registros
        return Promise.resolve(rows);
    } catch (error) {
        // Se muestra el error y se retorna un mensaje de error
        console.log("Error:", error);
        return Promise.reject("Ocurrio un error al intentar obtener los datos");
    } finally {
        // Cerramos la conexión a la base de datos, independientemente del resultado
        db.end();
    }
}

async function crearCliente(Nombre, Telefono) {
    // Establecemos la conexión con la base de datos
    const db = await connect();
    try {
        // Consulta para insertar un nuevo registro y obtener el ID generado
        const [result] = await db.execute(
            "INSERT INTO Cliente (Nombre, Telefono) VALUES (?, ?)",
            [Nombre, Telefono]
        );

        // Verificamos que la inserción fue exitosa y obtenemos el ID del nuevo cliente
        const clienteId = result.insertId; // `insertId` almacena el ID del último registro insertado

        console.log("Registro insertado correctamente con ID:", clienteId);
        return { id: clienteId, Nombre, Telefono }; // Retornamos el objeto con el ID del cliente
    } catch (error) {
        // Se muestra el error y se retorna un mensaje de error
        console.error("Error al insertar el registro:", error);
        throw new Error("Error al crear el cliente."); // Propagamos el error para manejarlo en el servicio
    } finally {
        // Cerramos la conexión a la base de datos, independientemente del resultado
        db.end();
    }
}

async function editarCliente(id_cliente,Nombre,Telefono) {
    // Establecemos la conexión a la base de datos
    const db = await connect();

    try {
        // Ejecutamos la consulta SQL para actualizar datos
        const [result] = await db.execute("UPDATE Cliente SET Nombre = ?, Telefono = ? WHERE id_cliente = ?", [Nombre,Telefono,id_cliente]);

        // Se devuelve el resultado de la operación
        console.log("Editado: ", result);
        return Promise.resolve("OK");
    } catch (error) {
        // Se muestra el error y se retorna un mensaje de error
        console.log("Error:", error);
        return Promise.reject("Ocurrio un error al intentar editar registros");
    } finally {
        // Cerramos la conexión a la base de datos, independientemente del resultado
        db.end();
    }
}

async function eliminarCliente(id_cliente) {
    // Establecemos la conexión a la base de datos
    const db = await connect();

    try {
        // Verificamos si el cliente existe antes de eliminarlo
        const [existeCliente] = await db.execute("SELECT * FROM Cliente WHERE id_cliente = ? ", [id_cliente]);

        if (!existeCliente || existeCliente.length === 0) {
            throw new Error("El cliente no existe");
        }

        // Si el cliente existe, procedemos a eliminarlo
        const [result] = await db.execute("DELETE FROM Cliente WHERE id_cliente = ?", [id_cliente]);

        if (result.affectedRows === 0) {
            throw new Error("No se pudo eliminar el cliente");
        }

        console.log("Eliminado correctamente");
        return "Cliente eliminado correctamente";
    } catch (error) {
        console.error("Error:", error.message);
        return `Ocurrió un error: ${error.message}`;
    } finally {
        // Cerramos la conexión a la base de datos correctamente
        await db.end();
    }
}

async function obtenerCliente(id_cliente) {
  // Establecemos la conexión a la base de datos
  const db = await connect();

  try {
    // Consulta para obtener solo un registro específico
    const [rows] = await db.execute("SELECT * FROM Cliente WHERE id_cliente = ?", [id_cliente]);

    // Verificamos si se encontró el usuario
    if (rows.length === 0) {
      return Promise.reject("Usuario no encontrado");
    }

    // Se retorna el usuario encontrado
    return Promise.resolve(rows[0]);
  } catch (error) {
    console.log("Error:", error);
    return Promise.reject("Ocurrió un error al intentar obtener el usuario");
  } finally {
    // Cerramos la conexión a la base de datos
    db.end();
  }
}

export default {
    obtenerRegistros,
    crearCliente,
    editarCliente,
    eliminarCliente,
    obtenerCliente
}