const connection = require('../database/connection');

module.exports = {
    async create(req, resp) {
        const { id } = req.body;
        if(id == undefined || id == null) {
            return resp.status(400)
            .json({error: 'No ONG found with this ID.'});
        }
        const ong = await connection('ongs')
        .where('id', id)
        .select('name')
        .first();

        if(!ong) {
            return resp.status(400)
            .json({error: 'No ONG found with this ID.'});
        }
        return resp.json(ong);
    }
}