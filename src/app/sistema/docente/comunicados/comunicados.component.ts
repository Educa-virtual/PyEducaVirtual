import { Component } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'

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
}

@Component({
    selector: 'app-comunicados',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './comunicados.component.html',
    styleUrl: './comunicados.component.scss',
})
export class ComunicadosComponent {
    comunicados = [
        {
            id: 1,
            titulo: 'Comunicado #1',
            estado: 'Activo',
            tipo: 'Anuncio',
            publicado: '12/02/2025',
            prioridad: 'Urgente',
            caduca: '12/03/2025',
            grupo: 'Apoderados y Estudiantes',
            texto: 'Estimados padres de familia y estudiantes...',
        },
        {
            id: 2,
            titulo: 'Comunicado #2',
            estado: 'Activo',
            tipo: 'Circular',
            publicado: '10/02/2025',
            prioridad: 'Normal',
            caduca: '10/03/2025',
            grupo: 'Docentes y Estudiantes',
            texto: 'Se informa a la comunidad educativa que...',
        },
        {
            id: 3,
            titulo: 'Comunicado #3',
            estado: 'Inactivo',
            tipo: 'Aviso',
            publicado: '01/02/2025',
            prioridad: 'Baja',
            caduca: '15/03/2025',
            grupo: 'Apoderados',
            texto: 'Recuerden actualizar sus datos de contacto...',
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
        }
    }

    // Cuando hacemos clic en "Editar"
    ditComunicado(com: Comunicado) {
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
            this.comunicados.push({ ...this.selectedComunicado })
            console.log('Comunicado creado:', this.selectedComunicado)
        } else {
            // Caso EDITAR
            const index = this.comunicados.findIndex(
                (c) => c.id === this.selectedComunicado.id
            )
            if (index !== -1) {
                this.comunicados[index] = { ...this.selectedComunicado }
                console.log('Comunicado actualizado:', this.selectedComunicado)
            }
        }
        // Limpia el formulario o vuelve a modo "crear"
        this.selectedComunicado = this.initComunicado()
    }
}
