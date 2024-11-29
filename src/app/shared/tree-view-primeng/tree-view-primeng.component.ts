import {
    Component,
    Input,
    OnInit,
    Output,
    SimpleChanges,
    OnChanges,
    TemplateRef,
    EventEmitter,
    ContentChild,
    ChangeDetectorRef,
} from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { TreeNode } from 'primeng/api' // Importación para el modelo de PrimeNG

@Component({
    selector: 'app-tree-view-primeng',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './tree-view-primeng.component.html',
    styleUrls: ['./tree-view-primeng.component.scss'],
})
export class TreeViewPrimengComponent implements OnInit, OnChanges {
    @Output() accionBtnItem: EventEmitter<{ accion: string; item: any }> =
        new EventEmitter()
    @Output() selectedRowDataChange = new EventEmitter()

    @Input() treeDataRaw: any[] = [] // Datos crudos que recibe el componente
    @Input() seccionesPorGrado: any = [] // Secciones como un array dinámico

    treeData: TreeNode[] = [] // Estructura formateada para el árbol

    @ContentChild('rowExpansionTemplate', { static: false })
    rowExpansionTemplate: TemplateRef<unknown>

    constructor(private cdRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        console.log('Estructura del árbol generada en OnInit:', this.treeData)
        this.treeData = this.formatTreeData(this.treeDataRaw)
        this.cdRef.detectChanges()
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['treeDataRaw'] && changes['treeDataRaw'].currentValue) {
            console.log(
                'Datos crudos han cambiado:',
                changes['treeDataRaw'].currentValue
            )
            this.treeData = this.formatTreeData(
                changes['treeDataRaw'].currentValue
            )
        }

        if (
            changes['seccionesPorGrado'] &&
            changes['seccionesPorGrado'].currentValue
        ) {
            console.log(
                'Secciones por grado han cambiado:',
                changes['seccionesPorGrado'].currentValue
            )
            this.treeData = this.formatTreeData(this.treeDataRaw) // Usa el valor actual de `this.treeDataRaw`
        }
    }

    // Método para convertir los datos crudos a TreeNode
    formatTreeData(rows: any[]): TreeNode[] {
        //   const tree: TreeNode[] = [];
        const nivelesMap = new Map<string, TreeNode>()

        rows.forEach((row) => {
            // Agregar el nivel
            if (!nivelesMap.has(row.cNivelNombre)) {
                nivelesMap.set(row.cNivelNombre, {
                    key: row.iNivelTipoId.toString(),
                    label: row.cNivelNombre,
                    expanded: true,
                    icon: 'pi pi-fw pi-folder',
                    children: [],
                })
            }
            const nivelNode = nivelesMap.get(row.cNivelNombre)

            // Agregar el ciclo
            let cicloNode = nivelNode?.children?.find(
                (c) => c.label === row.cCicloNombre
            )
            if (!cicloNode) {
                cicloNode = {
                    key: `${row.iNivelTipoId}-${row.cCicloRomanos}`,
                    label: row.cCicloNombre,
                    expanded: true,
                    icon: 'pi pi-fw pi-folder',
                    children: [],
                }
                nivelNode?.children?.push(cicloNode)
            }
            // Obtener cantidad de secciones para el grado actual
            //  const cantidadSecciones = this.seccionesPorGrado[row.cGradoNombre] || 0;
            console.log(
                this.seccionesPorGrado,
                'this.seccionesPorGrado en el treeee'
            )
            // Obtener las secciones para el grado actual
            const secciones = this.seccionesPorGrado[row.cGradoNombre] || []

            // Agregar el grado con la cantidad de secciones en el título
            // Agregar el grado
            cicloNode.children?.push({
                key: `${row.iNivelTipoId}-${row.cCicloRomanos}-${row.cGradoNombre}`,
                label: `${row.cGradoNombre} (${secciones.length})`,

                data: `${row.cGradoAbreviacion} (${row.cCicloRomanos})`,
                icon: 'pi pi-fw pi-folder',
                expanded: true,
                children: secciones.map((seccion, index) => ({
                    key: `seccion-${row.cGradoNombre}-${index + 1}`,
                    label: `Sección ${seccion}`, // Puede ser letra o número
                    icon: 'pi pi-fw pi-file',
                })),
            })
        })

        return Array.from(nivelesMap.values())
    }

    accionBtn(accion, item) {
        const data = {
            accion,
            item,
        }
        this.accionBtnItem.emit(data)
    }
    onSelectionChange(event) {
        // this.selectedRowData = event
        this.selectedRowDataChange.emit(event)
    }
}
