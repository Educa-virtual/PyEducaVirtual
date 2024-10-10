import { PrimengModule } from '@/app/primeng.module'
import { CommonModule } from '@angular/common'
import { Component, OnInit, ViewChild } from '@angular/core'
import { Dialog } from 'primeng/dialog'
import { DialogService } from 'primeng/dynamicdialog'

@Component({
    selector: 'app-evaluacion-form-container-',
    standalone: true,
    imports: [CommonModule, PrimengModule],
    templateUrl: './evaluacion-form-container.component.html',
    styleUrl: './evaluacion-form-container.component.scss',
    providers: [DialogService],
})
export class EvaluacionFormContainerComponent implements OnInit {
    @ViewChild('dialogRef') dialogRef!: Dialog

    constructor() {}

    onDialogShow() {
        console.log(this.dialogRef, 'test')

        if (this.dialogRef) {
            this.dialogRef.maximize()
        }
    }

    ngOnInit(): void {
        console.log(this.dialogRef, 'test')
    }
}
