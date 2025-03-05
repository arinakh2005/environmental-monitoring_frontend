import { EnvironmentalSubsystem } from '../enums/environmental-subsystem';

export type EnvironmentalIndicator = {
    id?: string | number,
    name: string,
    measurementUnit: string,
    subsystemType: EnvironmentalSubsystem,
    isVisible?: boolean,
}
