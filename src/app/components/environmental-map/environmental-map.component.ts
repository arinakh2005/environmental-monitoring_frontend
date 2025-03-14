import {
    ApplicationRef,
    Component,
    ComponentFactoryResolver,
    ComponentRef, EventEmitter, Injector, Input, OnChanges, Output,
    SimpleChanges,
} from '@angular/core';
import * as L from 'leaflet';
import { FacilitySummaryComponent } from '../facility-summary-modal/facility-summary.component';
import { EnvironmentalFacility } from '../../types/environmental-facility';
import { Subscription } from 'rxjs';
import { EnvironmentalFacilityIndicator } from '../../types/environmental-facility-indicator';
import { EnvironmentalLayer } from '../../types/environmental-layer';

@Component({
    selector: 'app-environmental-map',
    standalone: true,
    imports: [],
    templateUrl: './environmental-map.component.html',
    styleUrl: './environmental-map.component.css',
})
export class EnvironmentalMapComponent implements OnChanges {
    @Input() layers: EnvironmentalLayer[] = [];
    @Input() environmentalFacilities: EnvironmentalFacility[] = [];

    @Output() bySelectFacility: EventEmitter<EnvironmentalFacility | null> = new EventEmitter();
    @Output() bySelectFacilityIndicator: EventEmitter<EnvironmentalFacilityIndicator | null> = new EventEmitter();

    public map!: L.Map;

    private _facilitySummaryComponentRef?: ComponentRef<FacilitySummaryComponent>;
    private _selectFacilitySubscription: Subscription | null = null;
    private _selectFacilityIndicatorSubscription: Subscription | null = null;

    constructor(
        private readonly componentFactoryResolver: ComponentFactoryResolver,
        private readonly injector: Injector,
        private readonly appRef: ApplicationRef,
    ) { }

    public ngOnChanges(simpleChanges: SimpleChanges): void {
        if (simpleChanges['environmentalFacilities']) {
            this.initializeMap();
        }
    }

    private initializeMap(): void {
        if (this.map) {
            this.map.eachLayer((layer) => {
                if (layer instanceof L.Marker) {
                    this.map.removeLayer(layer);
                }
            });
        } else {
            this.map = L.map('map');
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
        }

        const bounds = L.latLngBounds([]);
        const markerColors = {
            'air_quality': '#da91ff',
            'coastal_water': '#809fff',
            'biodiversity': '#80ff80',
            'radiation': '#ffe380',
        };

        this.environmentalFacilities.forEach((facility) => {
            const coordinates = this.getParseCoordinates(facility.coordinates);
            if (coordinates) {
                const color = markerColors[facility.subsystemType] || 'gray';
                const marker = L.marker(coordinates, { icon: this.getColoredIcon(color) }).addTo(this.map);

                marker.on('click', () => this.openFacilitySummaryPopup(marker, facility));
                bounds.extend(coordinates);
            }
        });

        if (bounds.isValid()) {
            this.map.fitBounds(bounds);
        } else {
            this.map.setView([50.4501, 30.5234], 10);
        }
    }

    private getParseCoordinates(coordinateStr: string): [number, number] | null {
        const match = coordinateStr.match(/(\d+)°\s*(\d+)'?\s*(\d+)"?\s*\s+(\d+)°\s*(\d+)'?\s*(\d+)"/);
        if (!match) return null;

        const latitude = parseFloat(match[1]) + parseFloat(match[2]) / 60 + parseFloat(match[3]) / 3600;
        const longitude = parseFloat(match[4]) + parseFloat(match[5]) / 60 + parseFloat(match[6]) / 3600;

        return [latitude, longitude];
    }

    private getColoredIcon(color: string): L.DivIcon {
        return L.divIcon({
            className: '',
            html: `
                <svg height="24" version="1.1" width="24" xmlns="http://www.w3.org/2000/svg" xmlns:cc="http://creativecommons.org/ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
                    <g transform="translate(0 -1028.4)">
                        <path d="m12.031 1030.4c-3.8657 0-6.9998 3.1-6.9998 7 0 1.3 0.4017 2.6 1.0938 3.7 0.0334 0.1 0.059 0.1 0.0938 0.2l4.3432 8c0.204 0.6 0.782 1.1 1.438 1.1s1.202-0.5 1.406-1.1l4.844-8.7c0.499-1 0.781-2.1 0.781-3.2 0-3.9-3.134-7-7-7zm-0.031 3.9c1.933 0 3.5 1.6 3.5 3.5 0 2-1.567 3.5-3.5 3.5s-3.5-1.5-3.5-3.5c0-1.9 1.567-3.5 3.5-3.5z" fill="black" />
                        <path d="m12.031 1.0312c-3.8657 0-6.9998 3.134-6.9998 7 0 1.383 0.4017 2.6648 1.0938 3.7498 0.0334 0.053 0.059 0.105 0.0938 0.157l4.3432 8.062c0.204 0.586 0.782 1.031 1.438 1.031s1.202-0.445 1.406-1.031l4.844-8.75c0.499-0.963 0.781-2.06 0.781-3.2188 0-3.866-3.134-7-7-7zm-0.031 3.9688c1.933 0 3.5 1.567 3.5 3.5s-1.567 3.5-3.5 3.5-3.5-1.567-3.5-3.5 1.567-3.5 3.5-3.5z" fill="${color}" transform="translate(0 1028.4)"/>
                    </g>
                </svg>
            `,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
        });
    }

    private openFacilitySummaryPopup(marker: L.Marker, facility: EnvironmentalFacility): void {
        if (this._facilitySummaryComponentRef) {
            this.appRef.detachView(this._facilitySummaryComponentRef.hostView);
            this._selectFacilitySubscription?.unsubscribe();
            this._selectFacilityIndicatorSubscription?.unsubscribe();
            this._facilitySummaryComponentRef.destroy();
        }

        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(FacilitySummaryComponent);
        const componentRef = componentFactory.create(this.injector);

        componentRef.instance.facility = facility;
        componentRef.instance.layers = this.layers;

        this._selectFacilityIndicatorSubscription = componentRef.instance.bySelectFacilityIndicator.subscribe((selectedFacilityIndicator: EnvironmentalFacilityIndicator) => {
            this.bySelectFacilityIndicator.emit(selectedFacilityIndicator);
        });
        this.appRef.attachView(componentRef.hostView);

        const popupElement = (componentRef.hostView as any).rootNodes[0];

        L.popup({
            minWidth: 425,
            maxWidth: 600,
            offset: [0, 0],
        }).setLatLng(marker.getLatLng())
            .setContent(popupElement)
            .openOn(this.map);

        this._facilitySummaryComponentRef = componentRef;
        this.bySelectFacility.emit(facility);
    }
}
