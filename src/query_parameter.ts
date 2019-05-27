import {PropertyType} from './';

export class QueryParameter {
    name : string;
    type : PropertyType;
    description? : string;
    exampleValues? : string[];
}