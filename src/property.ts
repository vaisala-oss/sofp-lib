
export enum PropertyType {
    string = 'string',
    number = 'number',
    integer = 'integer',
    boolean = 'boolean',
    array = 'array',
    object = 'object'
};

export class Property {
    name : string;
    type : PropertyType;
    description? : string;
    exampleValues? : string[];
};
