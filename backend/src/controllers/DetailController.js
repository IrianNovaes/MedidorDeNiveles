const connection = require("../database/connections");

//Meneja y guarda la conexion servidor - nodemcu

module.exports = {
  //[HTTP - GET]
  //Retorna el ultimo detalle recibido
  async index(request, response) {
    try {
      const auth = request.headers.authorizations;
      //si el amount enviado es 1 respondemos con el ultimo dato guardado
      const amount = request.headers.amount;
      let  details;

     if(amount == 1){
      details = await connection("details")
        .where("auth", auth)
        .max("date")
        .select("id","auth","date","distance");
     }else {
      details = await connection("details")
      .where("auth", auth)
      .select("*");
     }
     
      if (details.length > 0) {
        return response.json(details);
      
      } else {
        return response
          .status(401)
          .json({ error: "Authentication number is invalid" });
      }
    } catch (e) {
      console.log(e);
    }
  },

  //[HTTP - POST]
  //Guarda la distancia enviada por el node en la Base de datos
  async create(request, response) {
    try {

      const distance =  parseInt(request.body.distance);
      const auth = request.headers.authorizations.toString();


      const module = await connection("modules")
        .where("auth", auth)
        .select("*");

      const date = new Date().toISOString();

      console.log("auth: "+auth);

      console.log(module);

      if (module.length > 0) {
        const [id] = await connection("details").insert({
          auth: auth,
          date,
          distance: distance,
        });

        return response.json(id.toString());
      } else {
        return response.json();
      }
    } catch (e) {
      console.log(e);
    }
  },
};
