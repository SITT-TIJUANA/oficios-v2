'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { FileText, CheckCircle, Archive, AlertTriangle, Clock, TrendingUp, Plus, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { formatDate, ESTADO_COLORS, ESTADO_LABELS, PRIORIDAD_COLORS } from '@/lib/utils'
import type { Oficio } from '@/types'

export default function DashboardPage() {
  const [stats, setStats] = useState({ pendientes: 0, concluidos: 0, archivados: 0, urgentes: 0, sinRespuesta: 0 })
  const [recientes, setRecientes] = useState<Oficio[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const cargar = async () => {
      const { data: oficios } = await supabase.from('oficios').select('*')
      if (oficios) {
        setStats({
          pendientes: oficios.filter(o => !['terminado','archivado'].includes(o.estado)).length,
          concluidos: oficios.filter(o => o.estado === 'terminado').length,
          archivados: oficios.filter(o => o.estado === 'archivado').length,
          urgentes: oficios.filter(o => o.prioridad === 'urgente' && !['terminado','archivado'].includes(o.estado)).length,
          sinRespuesta: oficios.filter(o => o.estado === 'sin_respuesta').length,
        })
        setRecientes(oficios.slice(0, 8) as Oficio[])
      }
      setLoading(false)
    }
    cargar()
  }, [])

  const cards = [
    { label: 'Pendientes', value: stats.pendientes, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    { label: 'Concluidos', value: stats.concluidos, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { label: 'Archivados', value: stats.archivados, icon: Archive, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-100' },
    { label: 'Urgentes', value: stats.urgentes, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
    { label: 'Sin respuesta', value: stats.sinRespuesta, icon: FileText, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },
    { label: 'Total', value: recientes.length, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
  ]

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {cards.map((card, i) => {
          const Icon = card.icon
          return (
            <div key={i} className={`card p-4 border ${card.border} animate-in`} style={{ animationDelay: `${i * 60}ms` }}>
              <div className={`w-9 h-9 ${card.bg} rounded-lg flex items-center justify-center mb-3`}>
                <Icon size={18} className={card.color} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{loading ? '--' : card.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{card.label}</p>
            </div>
          )
        })}
      </div>

      {/* Recent oficios */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <h2 className="font-semibold text-gray-900">Oficios recientes</h2>
          <Link href="/oficios" className="text-guinda-700 text-sm font-medium hover:underline flex items-center gap-1">
            Ver todos <ArrowRight size={14} />
          </Link>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Cargando...</div>
        ) : recientes.length === 0 ? (
          <div className="p-12 text-center">
            <FileText size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No hay oficios registrados</p>
            <Link href="/oficios/nuevo" className="btn-primary mt-4 mx-auto w-fit text-sm">
              <Plus size={15} /> Registrar primer oficio
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50">
                  {['Numero', 'Tema', 'Estado', 'Prioridad', 'Fecha', ''].map(h => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recientes.map(o => (
                  <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-3 text-sm font-mono font-medium text-gray-900">{o.numero}</td>
                    <td className="px-6 py-3 text-sm text-gray-700 max-w-xs truncate">{o.tema}</td>
                    <td className="px-6 py-3">
                      <span className={`badge ${ESTADO_COLORS[o.estado]}`}>{ESTADO_LABELS[o.estado]}</span>
                    </td>
                    <td className="px-6 py-3">
                      <span className={`badge ${PRIORIDAD_COLORS[o.prioridad]}`}>{o.prioridad}</span>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-500">{formatDate(o.fecha_inicio)}</td>
                    <td className="px-6 py-3">
                      <Link href={`/oficios/${o.id}`} className="text-guinda-700 hover:text-guinda-900 text-xs font-medium">Ver</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
