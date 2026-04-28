import pool from '../db.js'

export async function getLists(req, res) {
  try {
    const [lists] = await pool.query(
      'SELECT * FROM Lists;'
    ) 
    res.json(lists)
  } catch (err) {
    console.error(err)
    res.status(500).json({error: 'server error'})
  } 
}
export async function  getListById(req, res) {
  const { id } = req.params

  try {
    const [list] = await pool.query(
      'SELECT * FROM Lists WHERE ListID = ?;',
      [id]
    )
    if (list.length === 0) {
      return res.status(404).json({error: 'List not found'})
    }
    const [tasks] = await pool.query(
      'SELECT * FROM Tasks WHERE ListID = ?',
      [id]  
    )
    res.json({...list[0], tasks})
  } catch (err) {
    console.error(err)
    res.status(500).json({error: "server error"})
  }
}
export async function postList(req, res) {
  const { boardId, title, position } = req.body ?? {}
  if (!boardId || !title || position === undefined) {
    return res.status(400).json({ error: 'boardId, title and position are required' })
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO Lists (BoardID, List_Title, Position) VALUES (?, ?, ?)',
      [boardId, title, position]
    )
    res.status(201).json({ id: result.insertId })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'server error' })
  }
}

export async function patchList(req, res) {
  const { id } = req.params
  const { title, position } = req.body ?? {}
  if (title === undefined && position === undefined) {
    return res.status(400).json({ error: 'at least one of title or position is required' })
  }
  try {
    const [result] = await pool.query(
      `UPDATE Lists SET
         List_Title = COALESCE(?, List_Title),
         Position   = COALESCE(?, Position)
       WHERE ListID = ?`,
      [title ?? null, position ?? null, id]
    )
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'list not found' })
    }
    res.status(200).json({ id: Number(id) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'server error' })
  }
}

export async function deleteList(req, res) {
  const { id } = req.params
  try {
    const [result] = await pool.query(
      'DELETE FROM Lists WHERE ListID = ?',
      [id]
    )
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'list not found' })
    }
    res.status(204).end()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'server error' })
  }
}
