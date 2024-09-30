import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { Component } from '@angular/core'
import { FormActividadesAprendizajeEvaluacionComponent } from '../form-actividades-aprendizaje-evaluacion/form-actividades-aprendizaje-evaluacion.component'
import { PrimengModule } from '@/app/primeng.module'

@Component({
    selector: 'app-actividades-aprendizaje-evaluacion',
    standalone: true,
    imports: [
        ContainerPageComponent,
        TablePrimengComponent,
        FormActividadesAprendizajeEvaluacionComponent,
        PrimengModule,
    ],
    templateUrl: './actividades-aprendizaje-evaluacion.component.html',
    styleUrl: './actividades-aprendizaje-evaluacion.component.scss',
})
export class ActividadesAprendizajeEvaluacionComponent {
    showModal: boolean = false
    itemActividades = []
    option: string

    actionsContainer = [
        {
            labelTooltip: 'Agregar',
            text: 'Agregar',
            icon: 'pi pi-plus',
            accion: 'agregar',
            class: 'p-button-primary',
        },
    ]
    actions = [
        {
            labelTooltip: 'Editar',
            icon: 'pi pi-pencil',
            accion: 'actualizar',
            type: 'item',
            class: 'p-button-rounded p-button-warning p-button-text',
        },
        {
            labelTooltip: 'Eliminar',
            icon: 'pi pi-trash',
            accion: 'eliminar',
            type: 'item',
            class: 'p-button-rounded p-button-danger p-button-text',
        },
    ]
    data = [
        {
            iIndicador: '1.1.',
            cIndicadorLogro: '-',
            cContenido:
                'Nociones básicas sobre aplicaciones móviles e Introducción a Flutter',
        },
        {
            iIndicador: '1.1.',
            cIndicadorLogro: 'Resultados evaluaciones Indicador 1.1',
            cContenido: 'Desarrollo de Interfaces',
        },
        {
            iIndicador: '1.2.',
            cIndicadorLogro: '-',
            cContenido: 'Adicionando Lógica a la Aplicación',
        },
        {
            iIndicador: '1.2.',
            cIndicadorLogro: 'Resultados evaluaciones Indicador 1.2',
            cContenido: 'Creación de Formularios  ',
        },
        {
            iIndicador: '1.2.',
            cIndicadorLogro:
                'Promedio del Indicador de logro PIL 1. Recuperación de Indicador de Logro 1',
            cContenido: 'Uso de Recursos.',
        },
        {
            iIndicador: '2.1.',
            cIndicadorLogro: '-',
            cContenido: 'Servicios',
        },
        {
            iIndicador: '2.1.',
            cIndicadorLogro: 'Resultados evaluaciones Indicador 2.1',
            cContenido: 'Administración de Errores y Despliegue',
        },
        {
            iIndicador: '2.1.',
            cIndicadorLogro: '',
            cContenido: 'Componentes de Flutte',
        },
        {
            iIndicador: '2.2.',
            cIndicadorLogro: 'Resultados evaluaciones Indicador 2.2',
            cContenido: 'Aplicación de Peliculas',
        },
        {
            iIndicador: '2.2.',
            cIndicadorLogro:
                'Promedio del Indicador de logro PIL 2. Recuperación de Indicador de Logro 2',
            cContenido: 'Diseños en Flutter',
        },
        {
            iIndicador: '3.1.',
            cIndicadorLogro: 'Resultados evaluaciones Indicador 3.1',
            cContenido: 'QRScanner – SQLite',
        },
        {
            iIndicador: '3.1.',
            cIndicadorLogro: '',
            cContenido:
                'CRUD hacia servicios REST, uso de camara y galeria de imagenes',
        },
        {
            iIndicador: '3.1.',
            cIndicadorLogro: '',
            cContenido: 'Aplicación de Noticias',
        },
        {
            iIndicador: '3.2.',
            cIndicadorLogro: '-',
            cContenido: 'Paquete propio de Mapbox',
        },
        {
            iIndicador: '3.2.',
            cIndicadorLogro: '-',
            cContenido: 'Taller de programacion',
        },
        {
            iIndicador: '3.2.',
            cIndicadorLogro:
                'Resultados evaluaciones Indicador 3.2. Promedio del Indicador de logro PIL 3. Recuperación de Indicador de Logro 3',
            cContenido: 'Sustentación de Trabajos Finales',
        },
        {
            iIndicador: '-',
            cIndicadorLogro: 'Evaluación Final',
            cContenido: 'Evaluación Fina',
        },
        {
            iIndicador: '-',
            cIndicadorLogro: 'Reporte de Información',
            cContenido: 'Reporte de Información',
        },
    ]
    columns = [
        {
            type: 'item',
            width: '1rem',
            field: 'cItem',
            header: 'Semana',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '1rem',
            field: 'iIndicador',
            header: 'Indicador',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '10rem',
            field: 'cIndicadorLogro',
            header: 'Indicador de Logro',
            text_header: 'center',
            text: 'justify',
        },
        {
            type: 'text',
            width: '12rem',
            field: 'cContenido',
            header: 'Contenido Básicos',
            text_header: 'center',
            text: 'justify',
        },
        {
            type: 'actions',
            width: '3rem',
            field: 'actions',
            header: 'Acciones',
            text_header: 'center',
            text: 'center',
        },
    ]

    accionBtnItem(elemento): void {
        const { accion } = elemento
        const { item } = elemento
        console.log(item)
        console.log(accion)
        switch (accion) {
            case 'agregar':
            case 'actualizar':
                this.showModal = true
                this.itemActividades = item
                this.option = accion === 'agregar' ? 'Agregar' : 'Actualizar'
                console.log(this.option)
                break
            case 'eliminar':
                //
                break
            case 'close-modal':
                this.showModal = false
                this.itemActividades = item
                break
            default:
                break
        }
    }
}
