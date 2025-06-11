import connect from "../middlewares/db.mjs";

async function buscarUsuario(Nick, Password) {
    const db = await connect();

    try {
        const [rows] = await db.execute(
            "SELECT id_usuario, Tipo_Usuario FROM Usuario WHERE Nick = ? AND Password = ?",
            [Nick, Password]
        );

        return Promise.resolve(rows);
    } catch (error) {
        console.log("Error:", error);
        return Promise.reject("Ocurrió un error al intentar obtener los datos");
    } finally {
        db.end();
    }
}

async function obtenerRegistrosA() {
  //establecemos la conexion a la base de datos
  const db = await connect();

  try{
    //consulta para obtener todos los registros
    const [rows] = await db.execute("SELECT * FROM Auto"); 
        
    //se retornan los registros
    return Promise.resolve(rows);
  } catch (error) {
    //se muestra el error y se retorna un mensaje de error
    console.log("Error:", error);
    return Promise.reject("Ocurrio un error al intertar obtener los datos");
  } finally {
    //cerramos la conexion a la base de datos, independientemente de si hubo error o no
    db.end();
  }
}


async function crearRegistroA({ Placa, Marca, Color, Tipo, id_cliente }) {
  const db = await connect();

  try {
    // Ejecutamos la consulta SQL para insertar los datos
    const [result] = await db.execute(
      "INSERT INTO Auto (Placa, Marca, Color, Tipo, id_cliente) VALUES (?, ?, ?, ?, ?)",
      [Placa || null, Marca || null, Color || null, Tipo || null, id_cliente || null]
    );

    // Verificamos si la inserción fue exitosa
    if (!result || !result.insertId) {
      throw new Error("No se pudo obtener el ID del auto.");
    }

    console.log("Auto insertado con ID:", result.insertId);
    
    // Devolvemos el objeto con el ID del auto recién insertado
    return { id: result.insertId };
  } catch (error) {
    console.error("Error al insertar auto:", error);
    throw new Error("Ocurrió un error al intentar agregar el auto.");
  } finally {
    db.end();
  }
}

async function eliminarRegistroA(id_cliente) {
    // Establecemos la conexión a la base de datos
    const db = await connect();

    try {
        // Verificamos si el auto existe antes de eliminarlo
        const [existeUsuario] = await db.execute("SELECT * FROM Auto WHERE id_cliente = ? ", [id_cliente]);

        if (existeUsuario.length === 0) {
            return Promise.reject("El cliente no tiene auto");
        }

        // Si el auto existe, procedemos a eliminarlo
        const [result] = await db.execute("DELETE FROM Auto WHERE id_cliente = ?", [id_cliente]);

        console.log("Eliminado: ", result);
        return Promise.resolve("Auto eliminado correctamente");
    } catch (error) {
        console.log("Error:", error);
        return Promise.reject("Ocurrió un error al intentar eliminar AUTO");
    } finally {
        // Cerramos la conexión a la base de datos
        db.end();
    }
}
async function obtenerAuto(id_cliente) {
  // Establecemos la conexión a la base de datos
  const db = await connect();

  try {
    // Consulta para obtener solo un registro específico
    const [rows] = await db.execute("SELECT * FROM Auto WHERE id_cliente = ?", [id_cliente]);

    // Verificamos si se encontró el usuario
    if (rows.length === 0) {
      return Promise.reject("Auto no encontrado");
    }

    // Se retorna el usuario encontrado
    return Promise.resolve(rows[0]);
  } catch (error) {
    console.log("Error:", error);
    return Promise.reject("Ocurrió un error al intentar obtener el Auto");
  } finally {
    // Cerramos la conexión a la base de datos
    db.end();
  }
}
async function obtenerAutoIA(id_Auto) {
  // Establecemos la conexión a la base de datos
  const db = await connect();

  try {
    // Consulta para obtener solo un registro específico
    const [rows] = await db.execute("SELECT * FROM Auto WHERE id_Auto = ?", [id_Auto]);

    // Verificamos si se encontró el usuario
    if (rows.length === 0) {
      return Promise.reject("Auto no encontrado id_Auto");
    }

    // Se retorna el usuario encontrado
    return Promise.resolve(rows[0]);
  } catch (error) {
    console.log("Error:", error);
    return Promise.reject("Ocurrió un error al intentar obtener el Auto id_Auto ");
  } finally {
    // Cerramos la conexión a la base de datos
    db.end();
  }
}

async function editarAuto( Placa, Marca, Color, Tipo, id_cliente ) {
    // Establecemos la conexión a la base de datos
    const db = await connect();

    try {
        // Ejecutamos la consulta SQL para actualizar todos los campos
        const [result] = await db.execute(
            "UPDATE Auto SET Placa = ?, Marca = ?, Color = ?, Tipo = ? WHERE id_cliente = ?",
            [Placa, Marca, Color, Tipo, id_cliente]
        );

        // Se devuelve el resultado de la operación
        console.log("Editado: ", result);
        return Promise.resolve("OK");
    } catch (error) {
        // Se muestra el error y se retorna un mensaje de error
        console.log("Error:", error);
        return Promise.reject("Ocurrió un error al intentar editar Auto");
    } finally {
        // Cerramos la conexión a la base de datos, independientemente del resultado
        db.end();
    }
}
export default {
    obtenerRegistrosA,
    crearRegistroA,
    eliminarRegistroA,
    obtenerAuto,
    editarAuto,
    obtenerAutoIA
};