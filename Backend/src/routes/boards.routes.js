import { Router } from 'express'
import { getBoards, postBoard, getBoardById, deleteBoardById } from '../controllers/boards.controller.js'

const router_board = Router()

router_board.get('/', getBoards)
router_board.post('/', postBoard)
router_board.get('/:id', getBoardById)
router_board.delete('/:id', deleteBoardById)

export default router_board
