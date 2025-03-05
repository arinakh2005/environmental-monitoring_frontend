import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { EnvironmentalFacility } from '../../types/environmental-facility';
import { MatFabButton, MatIconButton, MatMiniFabButton } from '@angular/material/button';
import { EnvironmentalFacilitiesService } from '../../services/environmental-facilities.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EnvironmentalSubsystem } from '../../enums/environmental-subsystem';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput} from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatAutocomplete, MatAutocompleteTrigger, MatOption } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { EnvironmentalIndicator } from '../../types/environmental-indicator';
import { Subscription } from 'rxjs';
import { EnvironmentalIndicatorsService } from '../../services/environmental-indicators.service';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { EnvironmentalFacilityIndicator } from '../../types/environmental-facility-indicator';
import { EnvironmentalLayer } from '../../types/environmental-layer';

@Component({
    selector: 'app-facility-summary',
    standalone: true,
    imports: [
        FormsModule,
        MatFormField,
        MatInput,
        MatIcon,
        MatLabel,
        MatMiniFabButton,
        MatFabButton,
        ReactiveFormsModule,
        MatAutocomplete,
        MatAutocompleteTrigger,
        MatOption,
        MatIconButton,
        CommonModule,
        MatDatepicker,
        MatDatepickerInput,
        MatDatepickerToggle,
        MatSuffix,
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
