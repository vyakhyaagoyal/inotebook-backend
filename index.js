require('dotenv').config();
const connectToMongo=require('./db');
const express = require('express')

connectToMongo();
const app = express()
const port = 5000

app.get('/', (req, res) => { //initial page
  res.send('Hello World Vyakhya!')
})

app.use(express.json())

//available routes
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
