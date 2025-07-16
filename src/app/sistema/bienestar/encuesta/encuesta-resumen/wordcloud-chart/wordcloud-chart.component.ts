import {
    AfterViewInit,
    Component,
    ElementRef,
    Input,
    ViewChild,
} from '@angular/core'
import { Chart } from 'chart.js/auto'
import { WordCloudController, WordElement } from 'chartjs-chart-wordcloud'

@Component({
    selector: 'app-wordcloud-chart',
    standalone: true,
    imports: [],
    templateUrl: './wordcloud-chart.component.html',
    styleUrl: './wordcloud-chart.component.scss',
})
export class WordcloudChartComponent implements AfterViewInit {
    @ViewChild('wordCloudCanvas') wordCloudCanvas: ElementRef<HTMLCanvasElement>
    @Input() wordCloudData: any
    @Input() WordCloudOptions: any

    constructor() {
        Chart.register(WordCloudController, WordElement)
    }

    ngAfterViewInit(): void {
        if (this.wordCloudCanvas) {
            new Chart(this.wordCloudCanvas.nativeElement, {
                type: 'wordCloud',
                data: this.wordCloudData,
                options: this.WordCloudOptions,
            })
        }
    }
}
