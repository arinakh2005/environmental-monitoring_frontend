import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions } from 'chart.js';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { EnvironmentalFacilitiesService } from '../../services/environmental-facilities.service';
import { EnvironmentalFacility } from '../../types/environmental-facility';
import { EnvironmentalFacilityIndicator } from '../../types/environmental-facility-indicator';
import { EnvironmentalIndicator } from '../../types/environmental-indicator';
import { EnvironmentalIndicatorsService } from '../../services/environmental-indicators.service';
import { EnvironmentalLayer } from '../../types/environmental-layer';
import { EnvironmentalSubsystem } from '../../enums/environmental-subsystem';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatAutocomplete, MatAutocompleteTrigger, MatOption } from '@angular/material/autocomplete';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatFabButton, MatIconButton, MatMiniFabButton } from '@angular/material/button';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput} from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { Subscription } from 'rxjs';
import { aqiLevels } from '../../constants/constants';

@Component({
    selector: 'app-facility-summary',
    standalone: true,
    imports: [
        BaseChartDirective,
        CommonModule,
        FormsModule,
        MatAutocomplete,
        MatAutocompleteTrigger,
        MatDatepicker,
        MatDatepickerInput,
        MatDatepickerToggle,
        MatFabButton,
        MatFormField,
        MatIcon,
        MatIconButton,
        MatInput,
        MatLabel,
        MatMiniFabButton,
        MatOption,
        MatSuffix,
        MatTooltip,
        ReactiveFormsModule,
    ],
    providers: [
        EnvironmentalIndicatorsService,
        provideNativeDateAdapter(),
        { provide: MAT_DATE_LOCALE, useValue: 'uk-UA' },
    ],
    templateUrl: './facility-summary.component.html',
    styleUrl: './facility-summary.component.css'
})
export class FacilitySummaryComponent implements OnInit, OnDestroy {
    @Input() facility!: EnvironmentalFacility;
    @Input() layers: EnvironmentalLayer[] = [];

    @Output() bySelectFacilityIndicator: EventEmitter<EnvironmentalFacilityIndicator> = new EventEmitter();

    public isEditMode = false;
    public editedFacility: Partial<EnvironmentalFacility> = { };
    public filteredIndicators: EnvironmentalIndicator[] = [];
    public subsystemTypes: { label: string, value: EnvironmentalSubsystem }[] = [
        { value: EnvironmentalSubsystem.AirQuality, label: 'Якість повітря' },
        { value: EnvironmentalSubsystem.Radiation, label: 'Радіація' },
        { value: EnvironmentalSubsystem.CoastalWater, label: 'Прибережні води' },
        { value: EnvironmentalSubsystem.Biodiversity, label: 'Біорізноманіття' },
    ];
    public fields: { key: keyof EnvironmentalFacility, label: string }[] = [
        { key: 'name', label: 'Назва об\'єкта' },
        { key: 'identifier', label: 'Ідентифікатор' },
        { key: 'station_code', label: 'Код станції' },
        { key: 'laboratory', label: 'Лабораторія' },
        { key: 'address', label: 'Адреса' },
        { key: 'coordinates', label: 'Географічні координати' },
    ];
    public indicators: EnvironmentalIndicator[] = [];
    public aqiChartData: { labels: string[]; datasets: { data: number[]; backgroundColor: string[]; borderWidth: number }[] } | null = null;
    public aqiChartOptions: ChartOptions<'doughnut'> = { };

    public readonly EnvironmentalSubsystem = EnvironmentalSubsystem;

    private _subscriptions: Subscription[] = [];

    constructor(
        private readonly facilitiesService: EnvironmentalFacilitiesService,
        private readonly indicatorsService: EnvironmentalIndicatorsService,
    ) { }

    public ngOnInit() {
        this.facility.facilityIndicators.forEach((facilityIndicator) => {
            const relatedLayer = this.layers.find((layer) => layer.key === facilityIndicator.environmentalIndicator?.subsystemType);
            const relatedIndicator = relatedLayer?.indicators?.find((layerIndicator) => layerIndicator.id === facilityIndicator.environmentalIndicator?.id);

            if (facilityIndicator.environmentalIndicator) {
                facilityIndicator.environmentalIndicator.isVisible = relatedIndicator?.isVisible;
            }
        });

        if (this.facility.calculatedData?.overallAqi) {
            const aqiRange = Array.from(aqiLevels.keys()).find((range) => this.facility.calculatedData!.overallAqi! <= range);
            const aqiInfo = aqiLevels.get(aqiRange || 50);

            if (aqiInfo) {
                this.facility.extra = {
                    aqiColor: aqiInfo.color,
                    aqiLabel: aqiInfo.label,
                    aqiDescription: aqiInfo.description,
                };
                this.aqiChartData = {
                    labels: ['AQI'],
                    datasets: [{
                        data: [this.facility.calculatedData?.overallAqi, 500 - this.facility.calculatedData?.overallAqi],
                        backgroundColor: [aqiInfo!.color, '#E0E0E0'],
                        borderWidth: 0,
                    }]
                };
                this.aqiChartOptions = {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '75%',
                    plugins: {
                        legend: { display: false },
                        tooltip: { enabled: false }
                    }
                };
            }
        }

        this._subscriptions.push(this.indicatorsService.getIndicators().subscribe((indicators) => {
            this.indicators.push(...indicators);
            this.filteredIndicators = [...this.indicators];
        }));
    }

    public ngOnDestroy() {
        this._subscriptions.forEach((subscription) => subscription.unsubscribe());
    }

    public displaySubsystemFn = (subsystemValue: EnvironmentalSubsystem) => {
        if (!subsystemValue) return '';

        return this.subsystemTypes.find((type) =>
            type.value === subsystemValue,
        )?.label || '';
    }

    public displayIndicatorFn = (facilityIndicatorId: number) => {
        if (!facilityIndicatorId) return '';

        return this.indicators.find((indicator) =>
            indicator.id === facilityIndicatorId,
        )?.name || '';
    }

    public filterIndicators(): void {
        if (this.editedFacility.subsystemType) {
            this.filteredIndicators = this.indicators.filter(indicator =>
                indicator.subsystemType === this.editedFacility.subsystemType,
            );
        } else {
            this.filteredIndicators = [...this.indicators];
        }
    }

    public toggleEditMode(): void {
        this.isEditMode = !this.isEditMode;
        if (this.isEditMode) {
            this.editedFacility = structuredClone(this.facility);
        }
    }

    public saveChanges(): void {
        const dataToUpdate = structuredClone(this.editedFacility);

        if (dataToUpdate.facilityIndicators) {
            dataToUpdate.facilityIndicators = dataToUpdate.facilityIndicators.map((indicator) => ({
                ...indicator,
                environmentalIndicator: { id: indicator.environmentalIndicator?.id ?? null },
                environmentalFacility: { id: this.facility.id ?? null }
            })) as EnvironmentalFacilityIndicator[];
        }

        this.facilitiesService.update(+this.facility!.id!, dataToUpdate).subscribe((updatedFacility) => {
            this.facility = updatedFacility;
            this.isEditMode = false;
        });
    }

    public addIndicator(): void {
        this.editedFacility.facilityIndicators?.push({
            value: '',
            date: new Date(),
            environmentalIndicator: { } as EnvironmentalIndicator,
        });
    }

    public removeIndicator(index: number): void {
        this.editedFacility.facilityIndicators?.splice(index, 1);
    }

    public showIndicatorChart(facilityIndicator: EnvironmentalFacilityIndicator): void {
        this.bySelectFacilityIndicator.emit(facilityIndicator);
    }
}
