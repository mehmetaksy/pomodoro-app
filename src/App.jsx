import TaskList from './TaskList'
import Auth from './Auth'
import './App.css'
import { useState, useEffect } from 'react'
import { supabase } from './supabase'

const MODES = {
  pomodoro: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
}
const COLORS = {
  pomodoro: '#ba4949',
  shortBreak: '#38858a',
  longBreak: '#397097',
}

function App() {
  const [mode, setMode] = useState('pomodoro')
  const [timeLeft, setTimeLeft] = useState(MODES.pomodoro)
  const [isRunning, setIsRunning] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!isRunning) return
    if (timeLeft === 0) {
      setIsRunning(false)
      new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg').play()
      return
    }
    const timer = setInterval(() => {
      setTimeLeft(t => t - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [isRunning, timeLeft])

  useEffect(() => {
    document.body.style.backgroundColor = COLORS[mode]
  }, [mode])

  const handleModeChange = (newMode) => {
    setMode(newMode)
    setTimeLeft(MODES[newMode])
    setIsRunning(false)
  }

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0')
  const seconds = String(timeLeft % 60).padStart(2, '0')

  if (!user) return <Auth />

  return (
    <div className="app">
      <div className="app-header">
        <h1>Pomodoro Timer</h1>
        <button className="signout-btn" onClick={() => supabase.auth.signOut()}>Çıkış</button>
      </div>

      <div className="mode-buttons">
        <button className={mode === 'pomodoro' ? 'active' : ''} onClick={() => handleModeChange('pomodoro')}>Pomodoro</button>
        <button className={mode === 'shortBreak' ? 'active' : ''} onClick={() => handleModeChange('shortBreak')}>Short Break</button>
        <button className={mode === 'longBreak' ? 'active' : ''} onClick={() => handleModeChange('longBreak')}>Long Break</button>
      </div>

      <div className="timer-box">
        <div className="timer-display">{minutes}:{seconds}</div>
      </div>

      <button className="start-btn" onClick={() => setIsRunning(r => !r)}>
        {isRunning ? 'PAUSE' : 'START'}
      </button>
      <button className="reset-btn" onClick={() => { setTimeLeft(MODES[mode]); setIsRunning(false) }}>↺</button>

      <TaskList user={user} />
    </div>
  )
}

export default App