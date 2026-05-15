import { useState } from 'react'
import { supabase } from './supabase'

function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setError('')
    setMessage('')
    setLoading(true)

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setError(error.message)
      } else if (data.session) {
        // Direkt giriş yapıldı
      } else {
        // Email onayı bekleniyor, otomatik giriş dene
        const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })
        if (loginError) setMessage('Kayıt başarılı! Lütfen e-postanı onayla, sonra giriş yap.')
      }
    }

    setLoading(false)
  }

  return (
    <div className="auth-container">
      <h1>Pomodoro Timer</h1>
      <div className="auth-box">
        <h2>{isLogin ? 'Giriş Yap' : 'Kayıt Ol'}</h2>

        <input
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        />

        {error && <p className="auth-error">{error}</p>}
        {message && <p className="auth-message">{message}</p>}

        <button className="auth-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? '...' : isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
        </button>

        <p className="auth-toggle">
          {isLogin ? 'Hesabın yok mu?' : 'Zaten hesabın var mı?'}
          <span onClick={() => { setIsLogin(!isLogin); setError(''); setMessage('') }}>
            {isLogin ? ' Kayıt Ol' : ' Giriş Yap'}
          </span>
        </p>
      </div>
    </div>
  )
}

export default Auth