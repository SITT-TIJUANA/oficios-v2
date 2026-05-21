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

function getInitials(name?: string | null): string {
  if (!name) return '??'
  return name.split(' ').slice(0, 2).map((n: string) => n[0]).join('').toUpperCase()
}

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [perfil, setPerfil] = useState<any>(null)
  const [listo, setListo] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    const cargar = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) { setListo(true); return }
      const { data } = await supabase
        .from('perfiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle()
      if (data) setPerfil(data)
      setListo(true)
    }
    cargar()
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
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
            <p style={{ color: '#e8c96d', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Sistema Municipal</p>
            <p className="text-white text-xs font-bold truncate">Tijuana, B.C.</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-5 overflow-y-auto space-y-6">
        {NAV_ITEMS.map(group => (
          <div key={group.section}>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', paddingLeft: '12px', marginBottom: '8px' }}>
              {group.section}
            </p>
            <div className="space-y-0.5">
              {(group.links as any[]).filter(link => !link.adminOnly || perfil?.rol === 'administrador').map(link => {
                const Icon = link.icon
                const active = isActive(link.href)
                return (
                  <Link key={link.href} href={link.href} style={{
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px',
                    borderRadius: '8px', textDecoration: 'none', transition: 'all 0.2s',
                    background: active ? 'rgba(255,255,255,0.15)' : 'transparent',
                    color: active ? 'white' : 'rgba(255,255,255,0.6)',
                  }}>
                    <Icon size={16} style={{ flexShrink: 0 }} />
                    <span style={{ flex: 1, fontSize: '14px' }}>{link.label}</span>
                    {active && <ChevronRight size={12} style={{ opacity: 0.5 }} />}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', borderRadius: '12px', cursor: 'pointer' }}
          className="hover:bg-white/10 transition-all group">
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ color: 'white', fontSize: '12px', fontWeight: 700 }}>{getInitials(perfil?.nombre_completo)}</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ color: 'white', fontSize: '12px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {!listo ? 'Cargando...' : (perfil?.nombre_completo || 'Usuario')}
            </p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', textTransform: 'capitalize' }}>
              {perfil?.rol || ''}
            </p>
          </div>
          <button onClick={handleLogout} style={{ color: 'rgba(255,255,255,0.3)', padding: '4px' }}
            className="opacity-0 group-hover:opacity-100 hover:text-red-300 transition-all">
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  )
}
