'use client'

import { Search, Bell, Plus } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/oficios': 'Oficios',
  '/instrucciones': 'Instrucciones',
  '/usuarios': 'Usuarios',
  '/reportes': 'Reportes',
  '/plantillas': 'Plantillas',
  '/flujo': 'Flujo visual',
}

export default function Topbar() {
  const pathname = usePathname()
  const title = Object.entries(TITLES).find(([k]) => pathname.startsWith(k))?.[1] || 'Sistema'

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center px-6 gap-4 flex-shrink-0">
      <h1 className="text-gray-900 font-semibold text-base flex-1">{title}</h1>
      <div className="relative hidden md:block">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input className="pl-8 pr-4 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-guinda-500/20 w-52" placeholder="Buscar oficios..." />
      </div>
      <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
        <Bell size={18} className="text-gray-500" />
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
      </button>
      <Link href="/oficios/nuevo" className="btn-primary text-sm py-1.5 px-3">
        <Plus size={15} /> Nuevo
      </Link>
    </header>
  )
}
