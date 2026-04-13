import express from 'express'

const app = express()
const PORT = 4000


app.use(express.static('frontend/dist'))

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}/`)
    
})

