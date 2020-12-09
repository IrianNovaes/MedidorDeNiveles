const connection = require("../database/connections");
const crypto = require("crypto");

module.exports = {
  //[HTTP - GET]
  //Genera un auth number que será usado en la autenticacion
  async index(request, response) {
    try {

      const module_id = request.headers.authorizations;
      const module = await connection("modules")
        .where("module_id", module_id)
        .select("*");
          
      if (module.length <= 0) {
        const authorizations = crypto.randomBytes(4).toString("HEX");
        try {
          await connection("modules").insert({
            module_id,
            auth: authorizations,
          });

          return response.json(authorizations.toString());
        } catch (e) {
          console.log(e);
        }
      } else {
        return response.json();
      }
    } catch (e) {
      console.log(e);
    }
  },

  //[HTTP - PUT]
  //LOGON - Localizamos el modulo por el id ingresado, actualizamos el nombre
  async update(request, response) {
    try {
      const { module_id, name,min_distance,max_distance  } = request.body;

      await connection("modules").where("module_id", module_id).update({
        name: name, 
        max_distance: parseFloat(max_distance),
        min_distance: parseFloat(min_distance),
      });
  
      const updatedModule = await connection("modules")
          .where("module_id", module_id)
          .select("*");

     return response.json(updatedModule);
     
    } catch (e) {
      console.log(e);
      return response.status(401).json({ error: "Id number invalid" });

    }
  },
};
