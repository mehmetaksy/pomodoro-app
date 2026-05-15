import { useState, useEffect } from 'react'
import { supabase } from './supabase'

function TaskList({ user }) {
  const [tasks, setTasks] = useState([])
  const [input, setInput] = useState('')

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: true })
    if (data) setTasks(data)
  }

  const addTask = async () => {
    if (!input.trim()) return
    const { data } = await supabase
      .from('tasks')
      .insert({ text: input, user_id: user.id })
      .select()
      .single()
    if (data) setTasks([...tasks, data])
    setInput('')
  }

  const toggleTask = async (id, done) => {
    await supabase.from('tasks').update({ done: !done }).eq('id', id)
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !done } : t))
  }

  const deleteTask = async (id) => {
    await supabase.from('tasks').delete().eq('id', id)
    setTasks(tasks.filter(t => t.id !== id))
  }

  return (
    <div className="task-list">
      <h3>Tasks</h3>
      <div className="task-input">
        <input
          type="text"
          placeholder="What are you working on?"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTask()}
        />
        <button onClick={addTask}>Add</button>
      </div>
      <ul>
        {tasks.map(task => (
          <li key={task.id} className={task.done ? 'done' : ''}>
            <span onClick={() => toggleTask(task.id, task.done)}>{task.text}</span>
            <button onClick={() => deleteTask(task.id)}>✕</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TaskList