import './App.css'
import { useState, useEffect } from 'react'

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

  useEffect(() => {
    if (!isRunning) return
    if (timeLeft === 0) {
      setIsRunning(false)
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

  return (
    
  <div className="app">
    <h1>Pomodoro Timer</h1>

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
  </div>
)
  
}

export default App