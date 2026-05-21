'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { cn, getInitials } from '@/lib/utils'
import type { Perfil } from '@/types'
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

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [perfil, setPerfil] = useState<Perfil | null>(null)

  useEffect(() => {
    const cargar = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('perfiles').select('*').eq('id', user.id).single()
      if (data) setPerfil(data)
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
          <div className="w-10 h-10 rounded-xl bg-yellow-400/20 border border-yellow-400/40 flex items-center justify-center flex-shrink-0">
            <Building2 size={20} className="text-yellow-300" />
          </div>
          <div className="min-w-0">
            <p className="text-yellow-300 text-[10px] font-bold tracking-widest uppercase">Sistema Municipal</p>
            <p className="text-white text-xs font-bold truncate">Tijuana, B.C.</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-5 overflow-y-auto space-y-6">
        {NAV_ITEMS.map(group => (
          <div key={group.section}>
            <p className="text-white/30 text-[9px] font-bold uppercase tracking-widest px-3 mb-2">{group.section}</p>
            <div className="space-y-0.5">
              {(group.links as any[]).filter(link => !link.adminOnly || perfil?.rol === 'administrador').map(link => {
                const Icon = link.icon
                const active = isActive(link.href)
                return (
                  <Link key={link.href} href={link.href} className={cn('nav-link', active && 'nav-link-active')}>
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
          <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">{getInitials(perfil?.nombre_completo)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate">{perfil?.nombre_completo || 'Cargando...'}</p>
            <p className="text-white/40 text-[10px] capitalize">{perfil?.rol || ''}</p>
          </div>
          <button onClick={handleLogout} className="text-white/30 hover:text-red-300 p-1 opacity-0 group-hover:opacity-100 transition-all">
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  )
}
