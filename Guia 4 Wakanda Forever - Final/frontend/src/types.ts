export interface Usuario {
  id_usuario: string;
  nombre: string;
  correo: string;
  rol: string;
  fecha_creacion: string;
}

export interface Paciente {
  id_paciente: string;
  nombre: string;
  dui: string;
  isss: string;
  nit: string;
  fecha_nacimiento: string;
  direccion: string;
  telefono: string;
  correo: string;
}

export interface Medico {
  id_medico: string;
  nombre: string;
  correo: string;
  especialidad_id: string;
  dui: string;
}

export interface Cita {
  id_cita: string;
  paciente_id: string;
  medico_id: string;
  fecha_hora: string;
  consultorio_id: string;
  estado: string;
  notas: string;
}

export interface Especialidad {
    id_especialidad: string;
    nombre: string;
    descripcion: string;
}

export interface Notificacion {
    id_notificacion: string;
    cita_id: string;
    tipo: string;
    contenido: string;
    fecha_envio: string;
    estado: string;
}