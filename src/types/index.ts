export type Rol = 'administrador' | 'usuario'

export type Perfil = {
  id: string
  nombre_completo: string
  cargo?: string
  departamento_id?: string
  rol: Rol
  avatar_url?: string
  activo: boolean
  creado_en: string
  departamento?: { id: string; nombre: string }
}

export type EstadoOficio = 'recibido' | 'elaboracion' | 'firmado' | 'requiere_respuesta' | 'sin_respuesta' | 'respondido' | 'terminado' | 'archivado'
export type Prioridad = 'baja' | 'normal' | 'alta' | 'urgente'

export type Oficio = {
  id: string
  numero: string
  tema: string
  descripcion?: string
  estado: EstadoOficio
  prioridad: Prioridad
  asignado_a?: string
  departamento_id?: string
  requiere_respuesta: boolean
  fecha_inicio: string
  fecha_despacho?: string
  fecha_respuesta?: string
  fecha_terminacion?: string
  observaciones?: string
  creado_por?: string
  creado_en: string
  actualizado_en: string
  asignado?: Perfil
  departamento?: { id: string; nombre: string }
  creador?: Perfil
}

export type Movimiento = {
  id: string
  oficio_id: string
  estado_anterior?: string
  estado_nuevo?: string
  comentario?: string
  realizado_por?: string
  creado_en: string
  usuario?: Perfil
}

export type Instruccion = {
  id: string
  folio?: string
  instruccion: string
  estado: string
  prioridad: Prioridad
  asignado_a?: string
  departamento_id?: string
  oficio_id?: string
  creado_por?: string
  creado_en: string
  asignado?: Perfil
}

export type Departamento = {
  id: string
  nombre: string
  descripcion?: string
  activo: boolean
}
