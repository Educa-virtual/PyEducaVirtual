import { Component } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { FormsModule } from '@angular/forms'

interface Comunicado {
    id: number
    titulo: string
    texto: string
    estado: string
    tipo: string
    publicado: string
    prioridad: string
    caduca: string
    grupo: string
    collapsed: boolean
}

@Component({
    selector: 'app-comunicados',
    standalone: true,
    imports: [PrimengModule, FormsModule],
    templateUrl: './comunicados.component.html',
    styleUrls: ['./comunicados.component.scss'],
})
export class ComunicadosComponent {
    comunicados = [
        {
            id: 1,
            titulo: 'Matriculas 2025',
            estado: 'Activo',
            tipo: 'Anuncio',
            publicado: '12/02/2025',
            prioridad: 'Urgente',
            caduca: '12/03/2025',
            grupo: 'Apoderados y Estudiantes',
            texto: 'Estimados padres de familia y estudiantes las matriculas son hasta....',
            collapsed: true,
        },
        {
            id: 2,
            titulo: 'Publicacion de Nuevos Ponderados',
            estado: 'Activo',
            tipo: 'Circular',
            publicado: '10/02/2025',
            prioridad: 'Normal',
            caduca: '10/03/2025',
            grupo: 'Docentes y Estudiantes',
            texto: 'Se informa a la comunidad educativa que las notas ponderadas son...',
            collapsed: true,
        },
        {
            id: 3,
            titulo: 'Carga Lectiva',
            estado: 'Inactivo',
            tipo: 'Aviso',
            publicado: '01/02/2025',
            prioridad: 'Baja',
            caduca: '15/03/2025',
            grupo: 'Apoderados',
            texto: 'Se comunica a los docentes que el numero de horas lectiva son 40 por semana',
            collapsed: true,
        },
    ]

    // Variable para el comunicado seleccionado (para editar)
    selectedComunicado: Comunicado = this.initComunicado()
    // Inicializa un comunicado vacío (para crear uno nuevo)
    initComunicado(): Comunicado {
        return {
            id: 0,
            titulo: '',
            texto: '',
            estado: '',
            tipo: '',
            publicado: '',
            prioridad: '',
            caduca: '',
            grupo: '',
            collapsed: true,
        }
    }

    // Cuando hacemos clic en "Editar"
    editComunicado(com: Comunicado) {
        // Creamos una copia del comunicado para no modificar el array original
        // si no deseas mutarlo directamente
        this.selectedComunicado = { ...com }
    }
    // Al hacer clic en "Publicar" o "Actualizar"
    guardarComunicado() {
        if (this.selectedComunicado.id === 0) {
            // Caso CREAR
            const nuevoId = this.comunicados.length + 1
            this.selectedComunicado.id = nuevoId
            this.comunicados.push({
                ...this.selectedComunicado,
                collapsed: true,
            })
            console.log('Comunicado creado:', this.selectedComunicado)
        } else {
            // Caso EDITAR
            const index = this.comunicados.findIndex(
                (c) => c.id === this.selectedComunicado.id
            )
            if (index !== -1) {
                this.comunicados[index] = {
                    ...this.selectedComunicado,
                    collapsed: this.comunicados[index].collapsed,
                }
                console.log('Comunicado actualizado:', this.selectedComunicado)
            }
        }
        // Limpia el formulario o vuelve a modo "crear"
        this.selectedComunicado = this.initComunicado()
    }
    togglePanel(event: Event, panel: any, comunicado: Comunicado) {
        // Alterna el estado local para cambiar el icono
        comunicado.collapsed = !comunicado.collapsed
        // Dispara la animación interna de PrimeNG con el evento correcto
        panel.toggle(event)
    }
    deleteComunicado(id: number) {
        this.comunicados = this.comunicados.filter((com) => com.id !== id)
        console.log('Comunicado eliminado:', id)
    }
}
