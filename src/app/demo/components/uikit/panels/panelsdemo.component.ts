import { Component, OnInit } from '@angular/core';
import { MenuItem, PrimeTemplate } from 'primeng/api';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonDirective, Button } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { AccordionModule } from 'primeng/accordion';
import { TabViewModule } from 'primeng/tabview';
import { PanelModule } from 'primeng/panel';
import { FieldsetModule } from 'primeng/fieldset';
import { MenuModule } from 'primeng/menu';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { SplitterModule } from 'primeng/splitter';

@Component({
    templateUrl: './panelsdemo.component.html',
    standalone: true,
    imports: [ToolbarModule, ButtonDirective, SplitButtonModule, AccordionModule, TabViewModule, PanelModule, FieldsetModule, MenuModule, InputTextModule, Button, DividerModule, SplitterModule, PrimeTemplate]
})
export class PanelsDemoComponent implements OnInit {

    items: MenuItem[] = [];

    cardMenu: MenuItem[] = [];

    ngOnInit() {
        this.items = [
            { label: 'Angular.io', icon: 'pi pi-external-link', url: 'http://angular.io' },
            { label: 'Theming', icon: 'pi pi-bookmark', routerLink: ['/theming'] }
        ];

        this.cardMenu = [
            {
                label: 'Save', icon: 'pi pi-fw pi-check'
            },
            {
                label: 'Update', icon: 'pi pi-fw pi-refresh'
            },
            {
                label: 'Delete', icon: 'pi pi-fw pi-trash'
            },
        ];
    }
    
}
