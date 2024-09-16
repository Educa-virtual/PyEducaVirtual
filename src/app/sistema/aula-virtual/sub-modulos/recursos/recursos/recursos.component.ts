import { Component, OnInit } from '@angular/core'
import { NodeService } from 'src/app/demo/service/node.service'
import { TreeNode, PrimeTemplate } from 'primeng/api'
import { TreeModule } from 'primeng/tree'
import { TreeTableModule } from 'primeng/treetable'
import { NgFor, NgIf } from '@angular/common'

@Component({
    templateUrl: './recurso.component.html',
    standalone: true,
    imports: [TreeModule, TreeTableModule, PrimeTemplate, NgFor, NgIf],
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
            { field: 'size', header: 'Size' },
            { field: 'type', header: 'Type' },
            { field: 'Acción', header: 'Acción' },
        ]
    }
}
