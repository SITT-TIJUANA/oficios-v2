import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name?: string | null): string {
  if (!name) return '??'
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

export function formatDate(date?: string | null): string {
  if (!date) return '--'
  return new Date(date).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })
}

export const ESTADO_LABELS: Record<string, string> = {
  recibido: 'Recibido', elaboracion: 'En elaboración', firmado: 'Firmado',
  requiere_respuesta: 'Requiere respuesta', sin_respuesta: 'Sin respuesta',
  respondido: 'Respondido', terminado: 'Terminado', archivado: 'Archivado',
}

export const ESTADO_COLORS: Record<string, string> = {
  recibido: 'bg-blue-100 text-blue-700',
  elaboracion: 'bg-yellow-100 text-yellow-700',
  firmado: 'bg-purple-100 text-purple-700',
  requiere_respuesta: 'bg-orange-100 text-orange-700',
  sin_respuesta: 'bg-red-100 text-red-700',
  respondido: 'bg-green-100 text-green-700',
  terminado: 'bg-emerald-100 text-emerald-700',
  archivado: 'bg-gray-100 text-gray-600',
}

export const PRIORIDAD_COLORS: Record<string, string> = {
  baja: 'bg-gray-100 text-gray-600',
  normal: 'bg-blue-100 text-blue-700',
  alta: 'bg-orange-100 text-orange-700',
  urgente: 'bg-red-100 text-red-700',
}
