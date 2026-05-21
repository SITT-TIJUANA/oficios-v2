'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { useState, useEffect } from 'react'
import { LayoutDashboard, FileText, ClipboardList, GitBranch, BarChart2, FileStack, Users, LogOut, Plus, ChevronRight, Building2 } from 'lucide-react'

const NAV_ITEMS = [
  { section: 'Principal', links: [{ href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }] },
  { section: 'Gestion', links: [
    { href: '/oficios', label: 'Oficios', icon: FileText },
    { href: '/instrucciones', label: 'Instrucciones', icon: ClipboardList },
    { href: '/oficios/nuevo', label: 'Nuevo oficio', icon: Plus },
  ]},
  { section: 'Reportes', links: [
    { href: '/reportes', label: 'Generar reporte', icon: BarChart2 },
    { href: '/plantillas', label: 'Plantillas', icon: FileStack },
  ]},
  { section: 'Administracion', links: [
    { href: '/usuarios', label: 'Usuarios', icon: Users, adminOnly: true },
    { href: '/flujo', label: 'Flujo visual', icon: GitBranch },
  ]},
]

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

function getInitials(name?: string | null): string {
  if (!name) return '??'
  return name.split(' ').slice(0, 2).map((n: string) => n[0]).join('').toUpperCase()
}

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [perfil, setPerfil] = useState<any>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cargar = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { setCargando(false); return }
        const { data } = await supabase.from('perfiles').select('*').eq('id', user.id).maybeSingle()
        setPerfil(data)
      } catch (e) {
        console.error(e)
      }
      setCargando(false)
    }
    cargar()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success('Sesion cerrada')
    router.push('/login')
  }

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col overflow-hidden" style={{ background: 'linear-gradient(180deg, #4a0018 0%, #7a1836 60%, #6b0a28 100%)' }}>
      <div className="px-5 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(201,168,76,0.2)', border: '1px solid rgba(201,168,76,0.4)' }}>
            <Building2 size={20} style={{ color: '#e8c96d' }} />
          </div>
          <div className="min-w-0">
            <p style={{ color: '#e8c96d' }} className="text-xs font-bold tracking-widest uppercase">Sistema Municipal</p>
            <p className="text-white text-xs font-bold truncate">Tijuana, B.C.</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-5 overflow-y-auto space-y-6">
        {NAV_ITEMS.map(group => (
          <div key={group.section}>
            <p className="text-white/30 text-xs font-bold uppercase tracking-widest px-3 mb-2">{group.section}</p>
            <div className="space-y-0.5">
              {(group.links as any[]).filter(link => !link.adminOnly || perfil?.rol === 'administrador').map(link => {
                const Icon = link.icon
                const active = isActive(link.href)
                return (
                  <Link key={link.href} href={link.href}
                    className={cn('flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer',
                      active ? 'bg-white/15 text-white font-medium' : 'text-white/60 hover:text-white hover:bg-white/10')}>
                    <Icon size={16} className="flex-shrink-0" />
                    <span className="flex-1 text-sm">{link.label}</span>
                    {active && <ChevronRight size={12} className="opacity-50" />}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/10 transition-all cursor-pointer group">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.2)' }}>
            <span className="text-white text-xs font-bold">{cargando ? '..' : getInitials(perfil?.nombre_completo)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate">{cargando ? 'Cargando...' : (perfil?.nombre_completo || 'Usuario')}</p>
            <p className="text-white/40 text-xs capitalize">{perfil?.rol || ''}</p>
          </div>
          <button onClick={handleLogout} className="text-white/30 hover:text-red-300 p-1 opacity-0 group-hover:opacity-100 transition-all">
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  )
}
