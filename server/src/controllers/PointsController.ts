import { Request, Response } from 'express';
import knex from '../database/connection';

class PointsCpontroller {
    async index (request: Request, response: Response)  {
        const { city, uf, items} = request.query;

        const parsedItems = String(items)
            .split(',')
            .map( item => Number(item.trim()));

        const points = knex('points')
            .join('points_items', 'points.id', '=', 'points_items.point_id')
            .whereIn('points_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*');

        return response.json(points)
    }

    async show (request: Request, response: Response)  {
        const { id } = request.params;

        const point = await knex('points').where('id', id).first();

        if(!point){
            return response.status(400).json({ message: 'Ponto não encontrado'});
        }

        const items = await knex('items')
        .join('points_items', 'items.id', '=', 'points_items.id')
        .where('points_items.point_id', id)
        .select('items.title');

        return response.json({point, items});
    }

    async create (request: Request, response: Response)  {
        const {
            name,
            email,
            whatsapp,
            longitude,
            latitude,
            city,
            uf,
            items
        } = request.body;
    
        const trx = await knex.transaction();
    
        const point = {
            image: 'image-fake',
            name,
            email,
            whatsapp,
            longitude,
            latitude,
            city,
            uf
        }

        const insertedIds = await trx('points').insert(point); 
    
        const point_id = insertedIds[0];
    
        const pointsItems = items.map((item_id: Number) => {
            return {
                item_id,
                point_id
            }
        })
    
        await trx('points_items').insert(pointsItems);
    
        return response.json({
            id: point_id,
            ...point,
        });
    }
}

export default PointsCpontroller;