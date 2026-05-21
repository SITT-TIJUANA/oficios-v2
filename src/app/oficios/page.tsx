'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Search, Filter, FileText } from 'lucide-react'
import Link from 'next/link'
import { formatDate, ESTADO_COLORS, ESTADO_LABELS, PRIORIDAD_COLORS } from '@/lib/utils'
import type { Oficio, EstadoOficio } from '@/types'

export default function OficiosPage() {
  const [oficios, setOficios] = useState<Oficio[]>([])
  const [loading, setLoading] = useState(true)
  const [buscar, setBuscar] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const supabase = createClient()

  useEffect(() => {
    const cargar = async () => {
      let q = supabase.from('oficios').select('*').order('creado_en', { ascending: false })
      if (filtroEstado) q = q.eq('estado', filtroEstado)
      const { data } = await q
      setOficios((data || []) as Oficio[])
      setLoading(false)
    }
    cargar()
  }, [filtroEstado])

  const filtrados = oficios.filter(o =>
    o.numero.toLowerCase().includes(buscar.toLowerCase()) ||
    o.tema.toLowerCase().includes(buscar.toLowerCase())
  )

  const estados: EstadoOficio[] = ['recibido', 'elaboracion', 'firmado', 'requiere_respuesta', 'sin_respuesta', 'respondido', 'terminado', 'archivado']

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={buscar} onChange={e => setBuscar(e.target.value)}
              className="input pl-9 w-52 text-sm" placeholder="Buscar..." />
          </div>
          <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}
            className="input w-44 text-sm">
            <option value="">Todos los estados</option>
            {estados.map(e => <option key={e} value={e}>{ESTADO_LABELS[e]}</option>)}
          </select>
        </div>
        <Link href="/oficios/nuevo" className="btn-primary">
          <Plus size={16} /> Nuevo oficio
        </Link>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Cargando oficios...</div>
        ) : filtrados.length === 0 ? (
          <div className="p-12 text-center">
            <FileText size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400">No se encontraron oficios</p>
            <Link href="/oficios/nuevo" className="btn-primary mt-4 mx-auto w-fit text-sm">
              <Plus size={15} /> Registrar oficio
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  {['Numero', 'Tema', 'Estado', 'Prioridad', 'Fecha inicio', 'Resp.', 'Acciones'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtrados.map(o => (
                  <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-sm font-medium text-gray-900">{o.numero}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 max-w-xs">
                      <p className="truncate">{o.tema}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${ESTADO_COLORS[o.estado]}`}>{ESTADO_LABELS[o.estado]}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${PRIORIDAD_COLORS[o.prioridad]}`}>{o.prioridad}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatDate(o.fecha_inicio)}</td>
                    <td className="px-4 py-3 text-center">
                      {o.requiere_respuesta ? <span className="text-orange-500 text-xs font-medium">Si</span> : <span className="text-gray-300 text-xs">No</span>}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/oficios/${o.id}`} className="text-guinda-700 hover:text-guinda-900 text-xs font-medium hover:underline">
                        Ver detalle
                      </Link>
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
