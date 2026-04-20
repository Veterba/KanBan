import express from 'express'
import 'dotenv/config'
import pool, { ping } from './db.js'

const app = express()
const PORT = process.env.PORT ?? 4000

app.use(express.json())

app.get('/api/debug/users', async (req, res) => {

    try {
        const [rows] = await pool.query('SELECT * FROM Users')
        res.json(rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({error: 'db query failed'})
        
    }
})

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}/api/debug/users`)
})
