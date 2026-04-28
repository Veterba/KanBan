import { Router } from 'express'
import { postTask, deleteTask, patchTask } from '../controllers/tasks.controller.js'

const router_task = Router()

router_task.post('/', postTask)
router_task.delete('/:id', deleteTask)
router_task.patch('/:id', patchTask)

export default router_task
