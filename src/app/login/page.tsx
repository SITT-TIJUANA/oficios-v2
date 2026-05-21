'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Lock, Mail, Building2, Loader2, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      toast.error('Credenciales incorrectas')
      setLoading(false)
      return
    }
    toast.success('Bienvenido al sistema')
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #4a0018 0%, #7a1836 40%, #9b2335 60%, #6b0a28 100%)' }}>
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute rounded-full border border-white/30"
              style={{ width: `${(i+1)*120}px`, height: `${(i+1)*120}px`, top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
          ))}
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center border border-white/30">
              <Building2 size={28} className="text-white" />
            </div>
            <div>
              <p className="text-white/60 text-xs tracking-widest uppercase">Sistema Institucional</p>
              <p className="text-white font-bold text-lg leading-tight">H. Ayuntamiento de Tijuana</p>
            </div>
          </div>
        </div>
        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="text-5xl font-black text-white leading-tight mb-4">
              Control de<br />
              <span className="text-yellow-300">Oficios</span><br />
              Municipales
            </h1>
            <p className="text-white/60 text-lg">Gestiona, da seguimiento y archiva todos los oficios e instrucciones del ayuntamiento.</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[['Oficios', 'Control total'], ['Flujo', 'Visual'], ['Reportes', 'PDF/Word']].map(([t, s]) => (
              <div key={t} className="bg-white/10 rounded-xl p-4 border border-white/20">
                <p className="text-white font-bold text-sm">{t}</p>
                <p className="text-white/50 text-xs">{s}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-white/30 text-xs relative z-10">Tijuana, Baja California &bull; Sistema Administrativo v2.0</p>
      </div>

      {/* Right login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl p-10 animate-in">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-guinda-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Lock size={28} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Iniciar Sesion</h2>
              <p className="text-gray-400 text-sm mt-1">Sistema restringido para personal autorizado</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Correo electronico</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    className="input pl-10" placeholder="usuario@tijuana.gob.mx" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Contrasena</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                    className="input pl-10 pr-10" placeholder="••••••••" required />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-guinda-700 hover:bg-guinda-800 text-white py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 mt-2">
                {loading ? <><Loader2 size={18} className="animate-spin" /> Verificando...</> : 'Entrar al sistema'}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-400">Acceso exclusivo para personal del ayuntamiento</p>
              <p className="text-xs text-gray-300 mt-1">H. Ayuntamiento de Tijuana &bull; Tijuana, B.C.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
