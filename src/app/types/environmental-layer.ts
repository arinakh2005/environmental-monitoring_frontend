import { EnvironmentalSubsystem } from '../enums/environmental-subsystem';
import { EnvironmentalIndicator } from './environmental-indicator';

export type EnvironmentalLayer = {
    key: EnvironmentalSubsystem,
    label: string,
    isSelected: boolean,
    isExpanded?: boolean,
    indicators?: EnvironmentalIndicator[],
}
