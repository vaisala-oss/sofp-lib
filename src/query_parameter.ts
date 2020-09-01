import {PropertyType} from './';

export interface QueryParameter {
    name : string;
    type : PropertyType;
    description? : string;
    exampleValues? : string[];
}