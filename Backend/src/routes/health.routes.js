import { Router } from 'express'
import { getHealth } from '../controllers/health.controller.js'

const router_health = Router()

router_health.get('/', getHealth)

export default router_health
