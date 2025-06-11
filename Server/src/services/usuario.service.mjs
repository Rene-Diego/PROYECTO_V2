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

async function obtenerRegistros() {
  //establecemos la conexion a la base de datos
  const db = await connect();

  try{
    //consulta para obtener todos los registros
    const [rows] = await db.execute("SELECT * FROM Usuario"); 
        
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

async function crearRegistro({ Nick, Correo, Tipo_Usuario, Password }) {
  // Establecemos la conexión a la base de datos
  const db = await connect();

  try {
    // Ejecutamos la consulta SQL para insertar los datos
    const [result] = await db.execute(
      "INSERT INTO Usuario (Nick, Correo, Tipo_Usuario, Password) VALUES (?, ?, ?, ?)",
      [Nick, Correo, Tipo_Usuario, Password]
    );

    // Se devuelve el resultado de la operación
    console.log("Insertado:", result);
    return Promise.resolve("OK");
  } catch (error) {
    // Se muestra el error y se retorna un mensaje de error
    console.log("Error:", error);
    return Promise.reject("Ocurrió un error al intentar agregar registros");
  } finally {
    // Cerramos la conexión a la base de datos, independientemente del resultado
    db.end();
  }
}

async function eliminarRegistro(id_usuario, Nick) {
    // Establecemos la conexión a la base de datos
    const db = await connect();

    try {
        // Verificamos si el usuario existe antes de eliminarlo
        const [existeUsuario] = await db.execute("SELECT * FROM Usuario WHERE id_usuario = ? AND Nick = ?", [id_usuario, Nick]);

        if (existeUsuario.length === 0) {
            return Promise.reject("El usuario no existe");
        }

        // Si el usuario existe, procedemos a eliminarlo
        const [result] = await db.execute("DELETE FROM Usuario WHERE id_usuario = ? AND Nick = ?", [id_usuario, Nick]);

        console.log("Eliminado: ", result);
        return Promise.resolve("Usuario eliminado correctamente");
    } catch (error) {
        console.log("Error:", error);
        return Promise.reject("Ocurrió un error al intentar eliminar registros");
    } finally {
        // Cerramos la conexión a la base de datos
        db.end();
    }
}
async function obtenerUsuario(id_usuario) {
  // Establecemos la conexión a la base de datos
  const db = await connect();

  try {
    // Consulta para obtener solo un registro específico
    const [rows] = await db.execute("SELECT * FROM Usuario WHERE id_usuario = ?", [id_usuario]);

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

async function editarUsuario(id_usuario, Nick, Correo, Tipo_Usuario, Password) {
    // Establecemos la conexión a la base de datos
    const db = await connect();

    try {
        // Ejecutamos la consulta SQL para actualizar todos los campos
        const [result] = await db.execute(
            "UPDATE Usuario SET Nick = ?, Correo = ?, Tipo_Usuario = ?, Password = ? WHERE id_usuario = ?",
            [Nick, Correo, Tipo_Usuario, Password, id_usuario]
        );

        // Se devuelve el resultado de la operación
        console.log("Editado: ", result);
        return Promise.resolve("OK");
    } catch (error) {
        // Se muestra el error y se retorna un mensaje de error
        console.log("Error:", error);
        return Promise.reject("Ocurrió un error al intentar editar registros");
    } finally {
        // Cerramos la conexión a la base de datos, independientemente del resultado
        db.end();
    }
}
export default {
    buscarUsuario,
    obtenerRegistros,
    crearRegistro,
    eliminarRegistro,
    obtenerUsuario,
    editarUsuario
};