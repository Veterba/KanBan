import pool from '../db.js'

export async function postTask(req, res) {
  const { listId, title, text, position } = req.body ?? {}
  if (!listId || !title || position === undefined) {
    return res.status(400).json({ error: 'listId, title and position are required' })
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO Tasks (ListID, Task_Title, Task_Text, Position) VALUES (?, ?, ?, ?)',
      [listId, title, text ?? null, position]
    )
    res.status(201).json({ id: result.insertId })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'server error' })
  }
}

export async function deleteTask(req, res) {
  const { id } = req.params
  try {
    const [result] = await pool.query(
      'DELETE FROM Tasks WHERE TaskID = ?',
      [id]
    )
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'task not found' })
    }
    res.status(204).end()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'server error' })
  }
}

export async function patchTask(req, res) {
  const { id } = req.params
  const { title, text, position, listId } = req.body ?? {}
  if (title === undefined && text === undefined && position === undefined && listId === undefined) {
    return res.status(400).json({ error: 'at least one of title, text, position or listId is required' })
  }
  try {
    const [result] = await pool.query(
      `UPDATE Tasks SET
         Task_Title = COALESCE(?, Task_Title),
         Task_Text  = COALESCE(?, Task_Text),
         Position   = COALESCE(?, Position),
         ListID     = COALESCE(?, ListID)
       WHERE TaskID = ?`,
      [title ?? null, text ?? null, position ?? null, listId ?? null, id]
    )
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'task not found' })
    }
    res.status(200).json({ id: Number(id) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'server error' })
  }
}
