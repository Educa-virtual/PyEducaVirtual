import { Component, OnInit } from '@angular/core'
import { NodeService } from 'src/app/demo/service/node.service'
import { TreeNode, PrimeTemplate } from 'primeng/api'
import { TreeModule } from 'primeng/tree'
import { TreeTableModule } from 'primeng/treetable'
import { NgFor, NgIf } from '@angular/common'

import { DropdownModule } from 'primeng/dropdown'
import { IconFieldModule } from 'primeng/iconfield'
import { InputIconModule } from 'primeng/inputicon'
import { InputTextModule } from 'primeng/inputtext'
import { CalendarModule } from 'primeng/calendar'
import { TableModule } from 'primeng/table'
import { ButtonModule } from 'primeng/button'
import { DialogModule } from 'primeng/dialog'

@Component({
    //templateUrl: './01.component.html',
    templateUrl: './recurso.component.html',
    styleUrl: './recurso.component.scss',
    standalone: true,
    imports: [
        TreeModule,
        DialogModule,
        ButtonModule,
        TableModule,
        CalendarModule,
        InputTextModule,
        InputIconModule,
        IconFieldModule,
        DropdownModule,
        TreeTableModule,
        PrimeTemplate,
        NgFor,
        NgIf,
    ],
})
export class RecursoComponent implements OnInit {
    files1: TreeNode[] = []

    files2: TreeNode[] = []

    files3: TreeNode[] = []

    selectedFiles1: TreeNode[] = []

    selectedFiles2: TreeNode[] = []

    selectedFiles3: TreeNode = {}

    cols: unknown[] = []

    constructor(private nodeService: NodeService) {}

    ngOnInit() {
        this.nodeService.getFiles().then((files) => (this.files1 = files))
        this.nodeService.getFilesystem().then((files) => (this.files2 = files))
        this.nodeService.getFiles().then((files) => {
            this.files3 = [
                {
                    label: 'Root',
                    children: files,
                },
            ]
        })

        this.cols = [
            { field: 'name', header: 'name' },
            { field: 'size', header: 'size' },
            { field: 'type', header: 'type' },
            { field: 'Acción', header: 'Acción' },
        ]
    }
}
