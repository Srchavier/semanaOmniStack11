const connection = require('../database/connection');

module.exports = {
    async list(req, resp) {
        const [count] = await connection('incidents').count();

        const { page = 1 } = req.query;
        const incidents = await connection('incidents')
        .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
        .limit(5)
        .offset((page * 1) * 5)
        .select([
            'incidents.*', 
            'ongs.name', 
            'ongs.email', 
            'ongs.whatsapp', 
            'ongs.city', 
            'ongs.uf'
        ]);

        resp.header('X-Total-Count', count['count(*)'])
        resp.header('X-Total-Pages', Math.ceil((count['count(*)']  / 5) - 1 ))

        return resp.json(incidents);
    },
    async create(req, resp) {
        const {title, description, value} = req.body;
        const ong_id = req.headers.authorization;

        const [id] = await connection('incidents').insert({
            title,
            description,
            value,
            ong_id
        });
        return resp.json({id});
    },
    async delete(req, resp) {
        const {id} = req.params;
        const  ong_id = req.headers.authorization;
        const incident = await connection('incidents')
        .where('id', id)
        .select('ong_id')
        .first();

        if(incident == undefined || incident.ong_id !== ong_id) {
            return resp.status(401).json({error: 'Operation not permitted.'});
        }

        await connection('incidents').where('id', id).delete();

        return resp.status(204).send();
    }
}