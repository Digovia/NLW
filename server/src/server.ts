import express from 'express';

const app = express();

app.get('/users', (request, response) => {
    console.log('Listagem de usuários');

    response.json([
        'Rodrigo',
        'Digo'
    ]);
});


app.listen(3333);