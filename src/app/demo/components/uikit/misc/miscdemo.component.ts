import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProgressBarModule } from 'primeng/progressbar';
import { BadgeModule } from 'primeng/badge';
import { Button } from 'primeng/button';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { AvatarModule } from 'primeng/avatar';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ScrollTopModule } from 'primeng/scrolltop';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
    templateUrl: './miscdemo.component.html',
    standalone: true,
    imports: [ProgressBarModule, BadgeModule, Button, AvatarGroupModule, AvatarModule, ScrollPanelModule, ScrollTopModule, TagModule, ChipModule, SkeletonModule]
})
export class MiscDemoComponent implements OnInit, OnDestroy {

    value = 0;

    interval: any;

    ngOnInit() {
        this.interval = setInterval(() => {
            this.value = this.value + Math.floor(Math.random() * 10) + 1;
            if (this.value >= 100) {
                this.value = 100;
                clearInterval(this.interval);
            }
        }, 2000);
    }

    ngOnDestroy() {
        clearInterval(this.interval);
    }
    
}
