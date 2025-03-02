import { EnvironmentalIndicator } from './environmental-indicator';
import { EnvironmentalFacility } from './environmental-facility';

export type EnvironmentalFacilityIndicator = {
    id?: number;
    value: string;
    date: Date;
    environmentalIndicator?: EnvironmentalIndicator;
    environmentalFacility?: EnvironmentalFacility;
}
