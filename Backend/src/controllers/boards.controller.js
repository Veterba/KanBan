import pool from '../db.js'

export async function getBoards(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM Boards ORDER BY BoardID')
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'server error' })
  }
}

export async function postBoard(req, res) {
  const { title, userId } = req.body ?? {}
  if (!title || !userId) {
    return res.status(400).json({ error: 'title and userId are required' })
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO Boards (UserID, Board_Title) VALUES (?, ?)',
      [userId, title]
    )
    res.status(201).json({ id: result.insertId })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'server error' })
  }
}
export async function deleteBoardById(req, res) {
  const { id } = req.params
  try {
    const [result] = await pool.query(
      'DELETE FROM Boards WHERE BoardID = ?',
      [id]
    )
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Board not found' })
    }
    res.status(204).end()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'server error' })
  }
}
export async function getBoardById(req, res) {
  const { id } = req.params
  try {
    const [boardRows] = await pool.query(
      'SELECT * FROM Boards WHERE BoardID = ?',
      [id]
    )
    if (boardRows.length === 0) {
      return res.status(404).json({ error: 'board not found' })
    }
    const board = boardRows[0]

    const [lists] = await pool.query(
      'SELECT * FROM Lists WHERE BoardID = ? ORDER BY Position',
      [id]
    )
    const listIds = lists.map(l => l.ListID)

    let tasks = []
    if (listIds.length > 0) {
      const [taskRows] = await pool.query(
        'SELECT * FROM Tasks WHERE ListID IN (?) ORDER BY Position',
        [listIds]
      )
      tasks = taskRows
    }

    const listsWithTasks = lists.map(l => ({
      ...l,
      tasks: tasks.filter(t => t.ListID === l.ListID),
    }))

    res.json({ ...board, lists: listsWithTasks })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'server error' })
  }
}
