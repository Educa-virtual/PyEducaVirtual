import { Component } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { ChartModule } from 'primeng/chart'
import { ActivatedRoute } from '@angular/router'
@Component({
    selector: 'app-nivel-pobreza',
    standalone: true,
    imports: [PrimengModule, ChartModule],
    templateUrl: './nivel-pobreza.component.html',
    styleUrl: './nivel-pobreza.component.scss',
})
export class NivelPobrezaComponent {
    private route: ActivatedRoute
}
