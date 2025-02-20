import { OnInit } from '@angular/core'
import { Component } from '@angular/core'
import { ConstantesService } from '../servicios/constantes.service'
import { Router } from '@angular/router'
import { NgFor, NgIf } from '@angular/common'
import { AppMenuitemComponent } from './app.menuitem.component'

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
    standalone: true,
    imports: [NgFor, NgIf, AppMenuitemComponent],
    styles: [
        `
            .footer {
                bottom: 70px;
                @media (max-width: 780px) {
                    height: 110px;
                }
            }
            .footer img {
                width: 200px;
            }

            .footer img.logo {
                object-fit: fill;
            }
        `,
    ],
})
export class AppMenuComponent implements OnInit {
    model = []

    constructor(
        private router: Router,
        private ConstantesService: ConstantesService
    ) {}

    ngOnInit() {
        this.model = this.ConstantesService.nav
    }
}
