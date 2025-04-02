import { EnvironmentalSubsystem } from '../enums/environmental-subsystem';

export type EnvironmentalIndicator = {
    id?: string | number,
    name: string,
    measurementUnit: string,
    norm: number | null,
    subsystemType: EnvironmentalSubsystem,
    isVisible?: boolean,
}
