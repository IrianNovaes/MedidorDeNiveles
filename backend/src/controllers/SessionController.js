const connection = require('../database/connections');

module.exports = {

    //[HTTP - GET]
    async create(request, response){

        try{
        const { auth } = request.body;

        const con = await connection ('modules')
        .where('auth', auth)
        .select()
        .first();

        if(!con || con.name == 'no name'){

            return response.status(400).json({error:'Something went wrong'});
        
        } else {
           return response.json(con); 
        }
        
        
        }catch(e){
            console.log(e);
            return response.status(400).json({error: 'Something went wrong.'});
        }
    },

}