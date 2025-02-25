import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TableModule } from 'primeng/table'
import { DropdownModule } from 'primeng/dropdown'
import { FormsModule } from '@angular/forms'
import { InputGroupModule } from 'primeng/inputgroup'
import { InputGroupAddonModule } from 'primeng/inputgroupaddon'
import { ButtonModule } from 'primeng/button'
import { httpService } from '@/app/servicios/httpService'
import { CheckboxModule } from 'primeng/checkbox'
import { ApiEspecialistasService } from '../../services/api-especialistas.service'

// Modelo de datos

// interface titulo {
//  nombre: string
//}

interface Product {
    id: number
    nombre: string
    grado: boolean
}

interface Profesor {
    id: number
    nombre: string
    grado: boolean
}

interface Especialista {
    _id: string
    label: string
}

@Component({
    selector: 'app-especialista-dremo',
    standalone: true,
    templateUrl: './especialista-dremo.component.html',
    imports: [
        CommonModule,
        TableModule,
        DropdownModule,
        FormsModule,
        InputGroupModule,
        InputGroupAddonModule,
        ButtonModule,
        CheckboxModule,
    ],
})
export class EspecialistaDremoComponent implements OnInit {
    products: Product[] = []
    profesores: Profesor[] = []
    titulo: string = 'Asignacion area de especialista'
    especialistas: Especialista[] = []
    especialistaSeleccionado: Especialista

    constructor(
        private httpService: httpService,
        private apiEspecialistasService: ApiEspecialistasService
    ) {}

    ngOnInit() {
        // Simulación de datos (puedes cambiar esto por una llamada HTTP)
        /* 
    this.apiEspecialistasService.listarEspecialista({
      iPersId: '',
      iDocenteId: '',
      cPersDocumento: '',
      cPersNombre: '',
      cPersPaterno: '',
      cPersMaterno: '',
      iPerfIlId: '',
      cPerfIlNombre: '',
      iCredId: '',
    }).subscribe({
      next: (response) => {
        if (response && response.data) {
          this.especialistas = response.data.map(item => ({
            _id: item.iPersId, // Usamos el mismo ID del API
            label: `${item.cPersDocumento} - ${item.cPersNombre} ${item.cPersPaterno} ${item.cPersMaterno} - ${item.cPerfIlNombre} - (${item.iCredId} áreas)`
          }));
        }
      },
      error: (err) => {
        console.error('Error obteniendo especialistas:', err);
      }
    }); 
 */

        // Simulación de datos (puedes cambiar esto por una llamada HTTP)

        this.products = [
            { id: 1, nombre: 'Matematica 1', grado: true },
            { id: 2, nombre: 'Comunicacion', grado: false },
            { id: 3, nombre: 'Ciencias', grado: false },
            { id: 4, nombre: 'Arte y cultura', grado: false },
            { id: 5, nombre: 'Educacion religiosa', grado: false },
        ]

        // Simulación de datos (puedes cambiar esto por una llamada HTTP)
        this.profesores = [
            { id: 1, nombre: 'Matematica', grado: true },
            { id: 2, nombre: 'Comunicacion', grado: false },
            { id: 3, nombre: 'Ciencias', grado: true },
            { id: 4, nombre: 'Arte y cultura', grado: true },
            { id: 5, nombre: 'Educacion religiosa', grado: true },
        ]
    }
}
