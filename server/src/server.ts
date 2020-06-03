import express, { json } from 'express';
import path from 'path';
import routes from './routes';

const app = express();

app.use(express.json());

app.use(routes);


app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')))
    //Rota: Endereço completoda requisição
    //Recurso: Qualentidade estamos acessando do sistema
    
    //GET: Buscar uma ou mais informações do back-end
    //POST: Criar uma nova informaçãono back-end
    //PUT: Atualizar uma informaçãoexistente no back-end
    //DELETE: Remover uma informação do back-end

    //Request Param: Parâmetros que vem na própria rota  que identificam um recurso
    //Query Param: Parâmetros que vem na própria rota, geralmente opcionais, que servem para filtros, paginação...
    //Request Body: Parâmetros para criação/atualizações de informações

    //Exemplos
    /*
        const users = [
            'Rodrigo',
            'Digo'
        ]

    app.get('/users', (request, response) => {
        const search = String(request.query.search);

        const filteredUsers = search ? users.filter(user => user.includes(search)) : users;

        return response.json(filteredUsers);
    });

    app.get('/users/:id', (request, response) => {
        const id = Number(request.params.id);

        const user = users[id];

        return response.json(user);
    });

    app.post('/users', (request, response) => {
        const data = request.body;

        const user = {
            name: data.name,
            email: data.email
        }

        return response.json(user);
    
    });
    */


app.listen(3333);