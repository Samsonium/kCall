import express from 'express';
import {resolve} from 'path';

const app = express();
app.use(express.static('public'));
app.get('/*', (_, res) => {
    res.sendFile(resolve('public', 'index.html'));
});
app.listen(7002, () => console.log('Static server started!'));
