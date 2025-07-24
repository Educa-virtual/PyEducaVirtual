import { Component, OnInit } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
@Component({
    selector: 'app-logro-alcanzado',
    standalone: true,
    imports: [PrimengModule, TablePrimengComponent],
    templateUrl: './logro-alcanzado.component.html',
    styleUrl: './logro-alcanzado.component.scss',
})
export class LogroAlcanzadoComponent implements OnInit {
    //breadCrumbHome: MenuItem
    ngOnInit() {
        console.log('Logro alcanzado')
    }
}
