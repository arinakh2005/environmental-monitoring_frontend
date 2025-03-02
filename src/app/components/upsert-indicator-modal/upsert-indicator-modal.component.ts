import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogModule,
    MatDialogRef,
    MatDialogTitle
} from '@angular/material/dialog';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { EnvironmentalIndicator } from '../../types/environmental-indicator';
import { MatAutocomplete, MatAutocompleteTrigger, MatOption } from '@angular/material/autocomplete';
import { EnvironmentalIndicatorsService } from '../../services/environmental-indicators.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EnvironmentalFacilitiesService } from '../../services/environmental-facilities.service';
import { EnvironmentalFacility } from '../../types/environmental-facility';
import { Subscription } from 'rxjs';
import { EnvironmentalSubsystem } from '../../enums/environmental-subsystem';

@Component({
    selector: 'app-upsert-indicator-modal',
    standalone: true,
    imports: [
        MatDialogModule,
        MatFormField,
        ReactiveFormsModule,
        MatDialogTitle,
        MatInput,
        MatDialogActions,
        MatButton,
        MatLabel,
        MatAutocomplete,
        MatAutocompleteTrigger,
        MatOption,
        MatFormFieldModule,
    ],
    providers: [
        EnvironmentalIndicatorsService,
        EnvironmentalFacilitiesService,
    ],
    templateUrl: './upsert-indicator-modal.component.html',
    styleUrl: './upsert-indicator-modal.component.css'
})
export class UpsertIndicatorModalComponent implements OnInit, OnDestroy {
    public form: FormGroup;
    public environmentalFacilities: EnvironmentalFacility[] = [];
    public subsystemTypes: { label: string, value: EnvironmentalSubsystem }[] = [
        { value: EnvironmentalSubsystem.AirQuality, label: 'Якість повітря' },
        { value: EnvironmentalSubsystem.Radiation, label: 'Радіація' },
        { value: EnvironmentalSubsystem.CoastalWater, label: 'Прибережні води' },
        { value: EnvironmentalSubsystem.Biodiversity, label: 'Біорізноманіття' },
    ];

    private _subscriptions: Subscription[] = [];

    constructor(
        @Inject(MAT_DIALOG_DATA)
        public readonly environmentalIndicator: EnvironmentalIndicator,
        public readonly dialogRef: MatDialogRef<UpsertIndicatorModalComponent>,
        public readonly facilitiesService: EnvironmentalFacilitiesService,
        private readonly snackBar: MatSnackBar,
        private readonly formBuilder: FormBuilder,
        private readonly environmentalIndicatorService: EnvironmentalIndicatorsService,
    ) {
        this.form = this.formBuilder.group({
            id: [environmentalIndicator.id],
            name: [environmentalIndicator.name, Validators.required],
            subsystemType: [environmentalIndicator.subsystemType, Validators.required],
        });
    }

    public ngOnInit(): void {
        this._subscriptions.push(this.facilitiesService.getAll().subscribe((result) => {
            this.environmentalFacilities.push(...result);
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

    public onSubmit(): void {
        if (this.form.valid) {
            this.environmentalIndicatorService.upsertIndicator(this.form.value).subscribe(() => {
                this.snackBar.open('Індикатор успішно збережено!', 'Закрити', {
                    duration: 3000,
                    horizontalPosition: 'right',
                    verticalPosition: 'bottom',
                });
                this.dialogRef.close(this.form.value);
            });
        }
    }

    public onCancel(): void {
        this.dialogRef.close();
    }
}
