import { render, screen, fireEvent, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import TaskInput from './TaskInput'

describe('TaskInput', () => {
  it('llama a addTask con el texto escrito por el usuario', async () => {
    // Arrange
    const addTask = vi.fn()
    render(<TaskInput addTask={addTask} />)
    const usuario = userEvent.setup()

    // Act
    const input = screen.getByPlaceholderText('Escribe una tarea...')
    await usuario.type(input, 'Comprar pan')
    await usuario.click(screen.getByText('Agregar'))

    // Assert
    expect(addTask).toHaveBeenCalledWith('Comprar pan')
  })

  it('no llama a addTask si el campo está vacío', async () => {
    const addTask = vi.fn()
    render(<TaskInput addTask={addTask} />)
    const usuario = userEvent.setup()

    await usuario.click(screen.getByText('Agregar'))

    expect(addTask).not.toHaveBeenCalled()
  })

  it('muestra un error temporal si el campo está vacío y lo limpia después de 2 segundos', () => {
    vi.useFakeTimers()
    const addTask = vi.fn()
    render(<TaskInput addTask={addTask} />)

    fireEvent.click(screen.getByText('Agregar'))

    expect(screen.getByText('⚠️ La tarea no puede estar vacía')).toBeInTheDocument()

    // Avanzar el tiempo para que se ejecute el setTimeout envuelto en act
    act(() => {
      vi.advanceTimersByTime(2000)
    })

    expect(screen.queryByText('⚠️ La tarea no puede estar vacía')).not.toBeInTheDocument()

    vi.useRealTimers()
  })
})
