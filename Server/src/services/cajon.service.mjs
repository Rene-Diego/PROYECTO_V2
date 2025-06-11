import connect from "../middlewares/db.mjs";



async function obtenerCajon() {
  //establecemos la conexion a la base de datos
  const db = await connect();

  try{
    //consulta para obtener todos los registros
    const [rows] = await db.execute("SELECT * FROM Cajon"); 
        
    //se retornan los registros
    return Promise.resolve(rows);
  } catch (error) {
    //se muestra el error y se retorna un mensaje de error
    console.log("Error:", error);
    return Promise.reject("Ocurrio un error al intertar obtener los cajones");
  } finally {
    //cerramos la conexion a la base de datos, independientemente de si hubo error o no
    db.end();
  }
}

async function crearCajon({ Estado, Tipo, Tamaño }) {
  // Establecemos la conexión a la base de datos
  const db = await connect();

  try {
    // Ejecutamos la consulta SQL para insertar los datos
    const [result] = await db.execute(
      "INSERT INTO Cajon (Estado, Tipo, Tamaño ) VALUES (?, ?, ?)",
      [Estado, Tipo, Tamaño ]
    );

    // Se devuelve el resultado de la operación
    console.log("Insertado:", result);
    return Promise.resolve("OK");
  } catch (error) {
    // Se muestra el error y se retorna un mensaje de error
    console.log("Error:", error);
    return Promise.reject("Ocurrió un error al intentar agregar Cajon");
  } finally {
    // Cerramos la conexión a la base de datos, independientemente del resultado
    db.end();
  }
}

async function eliminarCajon(id_Cajon) {
    // Establecemos la conexión a la base de datos
    const db = await connect();

    try {
        // Verificamos si el auto existe antes de eliminarlo
        const [existeUsuario] = await db.execute("SELECT * FROM Cajon WHERE id_Cajon = ? ", [id_Cajon]);

        if (existeUsuario.length === 0) {
            return Promise.reject("El cajo no existe");
        }

        // Si el auto existe, procedemos a eliminarlo
        const [result] = await db.execute("DELETE FROM Cajon WHERE id_Cajon = ?", [id_Cajon]);

        console.log("Eliminado: ", result);
        return Promise.resolve("Cajon eliminado correctamente");
    } catch (error) {
        console.log("Error:", error);
        return Promise.reject("Ocurrió un error al intentar eliminar el cajon");
    } finally {
        // Cerramos la conexión a la base de datos
        db.end();
    }
}
async function editarCajon(id_Cajon, Estado) {
    // Establecemos la conexión a la base de datos
    const db = await connect();

    try {
        // Ejecutamos la consulta SQL para actualizar todos los campos
        const [result] = await db.execute(
            "UPDATE Cajon SET Estado = ? WHERE id_Cajon = ?",
            [Estado, id_Cajon]
        );

        // Se devuelve el resultado de la operación
        console.log("Editado: ", result);
        return Promise.resolve("OK");
    } catch (error) {
        // Se muestra el error y se retorna un mensaje de error
        console.log("Error:", error);
        return Promise.reject("Ocurrió un error al intentar editar cajon");
    } finally {
        // Cerramos la conexión a la base de datos, independientemente del resultado
        db.end();
    }
}
async function editarCajonTodo(id_Cajon, Estado, Tamaño, Tipo) {
    // Establecemos la conexión a la base de datos
    const db = await connect();

    try {
        // Verificamos si el id_Cajon existe en la base de datos
        const [existe] = await db.execute(
            "SELECT COUNT(*) AS count FROM Cajon WHERE id_Cajon = ?",
            [id_Cajon]
        );

        if (existe[0].count === 0) {
            throw new Error("El cajón con el ID proporcionado no existe.");
        }

        // Ejecutamos la consulta SQL para actualizar todos los campos
        const [result] = await db.execute(
            "UPDATE Cajon SET Estado = ?, Tamaño = ?, Tipo = ? WHERE id_Cajon = ?",
            [Estado, Tamaño, Tipo, id_Cajon]
        );

        console.log("Editado: ", result);
        return Promise.resolve("OK");
    } catch (error) {
        console.log("Error:", error);
        return Promise.reject("Ocurrió un error al intentar editar el cajón");
    } finally {
        // Cerramos la conexión a la base de datos, independientemente del resultado
        db.end();
    }
}
export default {
  obtenerCajon,
  crearCajon,
  eliminarCajon,
  editarCajon,
  editarCajonTodo
};