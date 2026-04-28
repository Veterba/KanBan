import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import pool from './db.js'
import healthRoute from './routes/health.routes.js'
import boardsRoute from './routes/boards.routes.js'
import listsRoute from './routes/lists.routes.js'
import tasksRoute from './routes/tasks.routes.js'

const app = express()
const PORT = process.env.PORT ?? 4000

app.use(express.json())
app.use(cors())

app.use('/api/health', healthRoute)
app.use('/api/boards', boardsRoute)
app.use('/api/lists', listsRoute)
app.use('/api/tasks', tasksRoute)

app.get('/api/debug/users', async (req, res) => {

    try {
        const [rows] = await pool.query('SELECT * FROM Users')
        res.json(rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({error: 'db query failed'})


    }
})

app.use((err, req, res, next) => {
    console.error(err)
    res.status(500).json({ error: 'server error' })
})

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
})