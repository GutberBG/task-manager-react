export function esCorreoValido(correo) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(correo)
}

export function contarTareasPendientes(tareas) {
  if (!tareas || !Array.isArray(tareas)) return 0
  return tareas.filter((t) => !t.completada).length
}
