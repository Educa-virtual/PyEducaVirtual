import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { AccordionModule } from 'primeng/accordion'
import { CalendarModule } from 'primeng/calendar'
import { IconFieldModule } from 'primeng/iconfield'
import { InputIconModule } from 'primeng/inputicon'
import { InputTextModule } from 'primeng/inputtext'
import { ContenidoRowComponent } from '../../components/contenido-row/contenido-row.component'

@Component({
    selector: 'app-tab-contenido',
    standalone: true,
    imports: [
        CommonModule,
        IconFieldModule,
        InputIconModule,
        InputTextModule,
        CalendarModule,
        FormsModule,
        AccordionModule,
        ContenidoRowComponent,
    ],
    templateUrl: './tab-contenido.component.html',
    styleUrl: './tab-contenido.component.scss',
})
export class TabContenidoComponent implements OnInit {
    rangeDates: Date[] | undefined

    ngOnInit(): void {
        const today = new Date()
        const nextWeek = new Date()
        nextWeek.setDate(today.getDate() + 7)

        this.rangeDates = [today, nextWeek]
    }
}
