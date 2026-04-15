import express from 'express'
import 'dotenv/config'

const app = express()
const PORT = process.env.DB_PORT ?? 4000

app.get('api/health', (req, res) => {
    res.json({status: 'ok'})
})
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}/`)
})

