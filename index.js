require('dotenv').config();
import connectToMongo from './db';
import express, { json } from 'express';

connectToMongo();
const app = express()
const port = 5000

app.get('/', (req, res) => { //initial page
  res.send('Hello World Vyakhya!')
})

app.use(json())

//available routes
app.use('/api/auth',require('./routes/auth').default)
app.use('/api/notes',require('./routes/notes'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
