import * as XLSX from 'xlsx';
import { Component, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { EnvironmentalProtectionMeasure } from '../../types/environmental-protection-measure';
import { EnvironmentalProtectionMeasuresService } from '../../services/environmental-protection-measures.service';
import { EnvironmentalSubsystem } from '../../enums/environmental-subsystem';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFabButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { asBlob } from 'html-docx-js-typescript'
import { environmentalSubsystemLabels } from '../../constants/constants';

@Component({
    selector: 'app-environmental-protection-measures',
    standalone: true,
    imports: [
        DecimalPipe,
        FormsModule,
        MatAutocompleteModule,
        MatFabButton,
        MatFormFieldModule,
        MatIcon,
        MatInputModule,
        MatTableModule,
    ],
    providers: [EnvironmentalProtectionMeasuresService],
    templateUrl: './environmental-protection-measures.component.html',
    styleUrl: './environmental-protection-measures.component.css'
})
export class EnvironmentalProtectionMeasuresComponent implements OnInit {
    public protectionMeasures: EnvironmentalProtectionMeasure[] = [];
    public dataSource = new MatTableDataSource<EnvironmentalProtectionMeasure>();
    public displayedColumns: string[] = ['index', 'subsystemType', 'objectName', 'protectionMeasureName', 'estimatedFunding', 'executionPeriod', 'expectedEffect', 'fundingSource', 'executor'];
    public selectedSubsystem: EnvironmentalSubsystem | null = null;
    public subsystemTypes: { label: string, value: EnvironmentalSubsystem }[] = [
        { value: EnvironmentalSubsystem.AirQuality, label: 'Якість повітря' },
        { value: EnvironmentalSubsystem.Radiation, label: 'Радіація' },
        { value: EnvironmentalSubsystem.CoastalWater, label: 'Прибережні води' },
        { value: EnvironmentalSubsystem.Biodiversity, label: 'Біорізноманіття' },
    ];

    public readonly environmentalSubsystemLabels: Map<EnvironmentalSubsystem, string> = environmentalSubsystemLabels;

    constructor(
        private readonly protectionMeasuresService: EnvironmentalProtectionMeasuresService,
    ) { }

    public ngOnInit() {
        this.fetchProtectionMeasures();
    }

    public displaySubsystemFn = (subsystemValue: EnvironmentalSubsystem) => {
        if (!subsystemValue) return '';

        return this.subsystemTypes.find((type) =>
            type.value === subsystemValue,
        )?.label || '';
    }

    public filterProtectionMeasures(): void {
        if (!this.selectedSubsystem) {
            this.dataSource.data = this.protectionMeasures;
        } else {
            this.dataSource.data = this.protectionMeasures.filter((protectionMeasure) =>
                protectionMeasure.subsystemType === this.selectedSubsystem,
            );
        }
    }

    public exportToExcel(): void {
        const headers = ['№', 'Підсистема', 'Назва об\'єкта', 'Назва заходу', 'Орієнтовні обсяги фінансування, грн', 'Термін виконання', 'Очікуваний ефект', 'Джерело фінансування', 'Відповідальні виконавці'];
        const data = this.dataSource.data.map((element, index) => ({
            '№': index + 1,
            'Підсистема': this.environmentalSubsystemLabels.get(element.subsystemType) || '-',
            'Назва об\'єкта': element.objectName || '-',
            'Назва заходу': element.protectionMeasureName || '-',
            'Орієнтовні обсяги фінансування, грн': element.estimatedFunding,
            'Термін виконання': element.executionPeriod || '-',
            'Очікуваний ефект': element.expectedEffect || '-',
            'Джерело фінансування': element.fundingSource || '-',
            'Відповідальні виконавці': element.executor || '-'
        }));
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data, { header: headers });
        const wb: XLSX.WorkBook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(wb, ws, 'Лист1');
        XLSX.writeFile(wb, 'data.xlsx');
    }

    public exportToDoc(): void {
        const headers = ['№', 'Підсистема', 'Назва об\'єкта', 'Назва заходу', 'Орієнтовні обсяги фінансування, грн', 'Термін виконання', 'Очікуваний ефект', 'Джерело фінансування', 'Відповідальні виконавці'];
        const data = this.dataSource.data.map((element, index) => (`
            <tr>
                <td>${index + 1}</td>
                <td>${this.environmentalSubsystemLabels.get(element.subsystemType) || '-'}</td>
                <td>${element.objectName || '-'}</td>
                <td>${element.protectionMeasureName || '-'}</td>
                <td>${element.estimatedFunding}</td>
                <td>${element.executionPeriod || '-'}</td>
                <td>${element.expectedEffect || '-'}</td>
                <td>${element.fundingSource || '-'}</td>
                <td>${element.executor || '-'}</td>
            </tr>
        `)).join('');

        const docContent = `
            <table border="1" style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr>
                        ${headers.map(header => `<th>${header}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${data}
                </tbody>
            </table>
        `;

        asBlob(docContent, { orientation: 'landscape' }).then((converted) => {
            const link = document.createElement('a');

            link.href = URL.createObjectURL(converted as Blob);
            link.download = 'data.docx';
            link.click();
        });
    }

    private fetchProtectionMeasures(): void {
        this.protectionMeasuresService.getMeasures().subscribe((response) => {
            this.protectionMeasures = response;
            this.filterProtectionMeasures();
        });
    }
}
