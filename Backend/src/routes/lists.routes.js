import { Router } from 'express'
import { postList, patchList, deleteList, getLists, getListById } from '../controllers/lists.controller.js'

const router_list = Router()

router_list.post('/', postList)
router_list.patch('/:id', patchList)
router_list.delete('/:id', deleteList)
router_list.get('/', getLists)
router_list.get('/:id', getListById)


export default router_list
