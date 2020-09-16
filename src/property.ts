
export enum PropertyType {
    string = 'string',
    number = 'number',
    integer = 'integer',
    boolean = 'boolean',
    array = 'array',
    object = 'object',
    reference = 'reference'
};

export interface Property {
    name : string;
    type : PropertyType;
    description? : string;
    exampleValues? : string[];
};
