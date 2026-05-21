'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { FileText, Download, Loader2, BarChart2 } from 'lucide-react'
import { ESTADO_LABELS, PRIORIDAD_COLORS, formatDate } from '@/lib/utils'
import { toast } from 'sonner'
import type { Oficio } from '@/types'

export default function ReportesPage() {
  const [oficios, setOficios] = useState<Oficio[]>([])
  const [loading, setLoading] = useState(true)
  const [filtros, setFiltros] = useState({ estado: '', prioridad: '', fechaDesde: '', fechaHasta: '' })
  const [generando, setGenerando] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const cargar = async () => {
      const { data } = await supabase.from('oficios').select('*').order('creado_en', { ascending: false })
      setOficios((data || []) as Oficio[])
      setLoading(false)
    }
    cargar()
  }, [])

  const filtrados = oficios.filter(o => {
    if (filtros.estado && o.estado !== filtros.estado) return false
    if (filtros.prioridad && o.prioridad !== filtros.prioridad) return false
    if (filtros.fechaDesde && o.fecha_inicio < filtros.fechaDesde) return false
    if (filtros.fechaHasta && o.fecha_inicio > filtros.fechaHasta) return false
    return true
  })

  const generarCSV = () => {
    setGenerando(true)
    const headers = ['Numero', 'Tema', 'Estado', 'Prioridad', 'Fecha Inicio', 'Requiere Respuesta', 'Observaciones']
    const rows = filtrados.map(o => [
      o.numero, o.tema, ESTADO_LABELS[o.estado], o.prioridad,
      formatDate(o.fecha_inicio), o.requiere_respuesta ? 'Si' : 'No', o.observaciones || ''
    ])
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `reporte-oficios-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    toast.success('Reporte CSV generado')
    setGenerando(false)
  }

  const stats = {
    total: filtrados.length,
    pendientes: filtrados.filter(o => !['terminado','archivado'].includes(o.estado)).length,
    terminados: filtrados.filter(o => o.estado === 'terminado').length,
    urgentes: filtrados.filter(o => o.prioridad === 'urgente').length,
  }

  return (
    <div className="space-y-5">
      {/* Filtros */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Filtros del reporte</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Estado</label>
            <select value={filtros.estado} onChange={e => setFiltros(p => ({ ...p, estado: e.target.value }))} className="input text-sm">
              <option value="">Todos</option>
              {Object.entries(ESTADO_LABELS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Prioridad</label>
            <select value={filtros.prioridad} onChange={e => setFiltros(p => ({ ...p, prioridad: e.target.value }))} className="input text-sm">
              <option value="">Todas</option>
              {['baja','normal','alta','urgente'].map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Desde</label>
            <input type="date" value={filtros.fechaDesde} onChange={e => setFiltros(p => ({ ...p, fechaDesde: e.target.value }))} className="input text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Hasta</label>
            <input type="date" value={filtros.fechaHasta} onChange={e => setFiltros(p => ({ ...p, fechaHasta: e.target.value }))} className="input text-sm" />
          </div>
        </div>
      </div>

      {/* Stats resumen */}
      <div className="grid grid-cols-4 gap-4">
        {[['Total', stats.total, 'text-blue-600', 'bg-blue-50'],
          ['Pendientes', stats.pendientes, 'text-orange-600', 'bg-orange-50'],
          ['Terminados', stats.terminados, 'text-green-600', 'bg-green-50'],
          ['Urgentes', stats.urgentes, 'text-red-600', 'bg-red-50']
        ].map(([l, v, tc, bc]) => (
          <div key={l as string} className={`card p-4 ${bc as string}`}>
            <p className={`text-2xl font-bold ${tc as string}`}>{v}</p>
            <p className="text-xs text-gray-500">{l}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button onClick={generarCSV} disabled={generando || filtrados.length === 0} className="btn-primary">
          {generando ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
          Exportar CSV / Excel
        </button>
        <p className="text-sm text-gray-400 self-center">{filtrados.length} oficios en el reporte</p>
      </div>

      {/* Table preview */}
      <div className="card overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-50 flex items-center gap-2">
          <BarChart2 size={16} className="text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Vista previa del reporte</span>
        </div>
        {loading ? <div className="p-6 text-center text-gray-400 text-sm">Cargando...</div> :
         filtrados.length === 0 ? <div className="p-6 text-center text-gray-400 text-sm">Sin resultados con los filtros actuales</div> : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/50">
                  {['Numero','Tema','Estado','Prioridad','Fecha','Resp.'].map(h => (
                    <th key={h} className="text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtrados.slice(0, 20).map(o => (
                  <tr key={o.id}>
                    <td className="px-4 py-2 font-mono text-xs text-gray-700">{o.numero}</td>
                    <td className="px-4 py-2 text-xs text-gray-700 max-w-xs truncate">{o.tema}</td>
                    <td className="px-4 py-2 text-xs">{ESTADO_LABELS[o.estado]}</td>
                    <td className="px-4 py-2 text-xs">{o.prioridad}</td>
                    <td className="px-4 py-2 text-xs text-gray-500">{formatDate(o.fecha_inicio)}</td>
                    <td className="px-4 py-2 text-xs">{o.requiere_respuesta ? 'Si' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtrados.length > 20 && <p className="text-xs text-gray-400 text-center py-3">...y {filtrados.length - 20} mas en el archivo exportado</p>}
          </div>
        )}
      </div>
    </div>
  )
}
