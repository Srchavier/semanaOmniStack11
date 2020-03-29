const connection = require('../database/connection');

module.exports = {
    async index(req, resp) {

        const ong_id = req.headers.authorization;
        if(ong_id == null || ong_id == undefined) {
            return resp.status(401).json({error: 'Operation not permitted.'});
        }
        const incidents = await connection('incidents')
        .where('ong_id', ong_id)
        .select('*');
        return resp.json(incidents);
    },
}