import { Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';
import { ChartData, ChartOptions, registerables } from 'chart.js';
import { EnvironmentalFacilityIndicatorsService } from '../../services/environmental-facility-indicators.service';
import { BaseChartDirective } from 'ng2-charts';
import Chart from 'chart.js/auto';
import { EnvironmentalFacilityIndicator } from '../../types/environmental-facility-indicator';
import { environmentalSubsystemColors } from '../../constants/constants';

Chart.register(...registerables);

@Component({
    selector: 'app-environmental-indicator-chart',
    standalone: true,
    imports: [
        BaseChartDirective,
    ],
    providers: [EnvironmentalFacilityIndicatorsService],
    templateUrl: './environmental-indicator-chart.component.html',
    styleUrl: './environmental-indicator-chart.component.css'
})
export class EnvironmentalIndicatorChartComponent implements OnChanges {
    @Input() facilityIndicator: EnvironmentalFacilityIndicator | null = null;
    @Input() facilityId: number | null = null;

    @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef;

    public chartData: ChartData<'line'> = { labels: [], datasets: [] };
    public chartOptions: ChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                labels: { color: 'rgba(255, 255, 255, 1)' },
            },
        },
        scales: {
            x: {
                ticks: { color: 'rgba(255, 255, 255, 1)' },
                grid: { color: 'rgba(255, 255, 255, 0.5)' },
            },
            y: {
                ticks: { color: 'rgba(255, 255, 255, 1)' },
                grid: { color: 'rgba(255, 255, 255, 0.5)' },
            },
        },
    };

    constructor(
        private readonly facilityIndicatorsService: EnvironmentalFacilityIndicatorsService,
    ) { }

    public ngOnChanges(): void {
        void this.updateChartData();
    }

    private async updateChartData(): Promise<void> {
        const unit = this.facilityIndicator?.environmentalIndicator?.measurementUnit || '';

        this.facilityIndicatorsService.getLastIndicators(+this.facilityId!, +this.facilityIndicator!.environmentalIndicator!.id!).subscribe((result) => {
            this.chartData = {
                labels: result.map((facilityIndicator) => new Date(facilityIndicator.date).toLocaleDateString()),
                datasets: [
                    {
                        label: `${this.facilityIndicator?.environmentalIndicator?.name} (${unit})`,
                        data: result.map((facilityIndicator) => +facilityIndicator.value),
                        pointBackgroundColor: 'rgba(255, 255, 255, 1)',
                        pointRadius: 5,
                        borderColor: environmentalSubsystemColors.get(this.facilityIndicator?.environmentalIndicator?.subsystemType!),
                    },
                ],
            };
        });

        this.chartOptions.plugins!.tooltip = {
            callbacks: {
                label: (tooltipItem) => ` ${tooltipItem.raw} ${unit}`,
            },
        };
    }
}
