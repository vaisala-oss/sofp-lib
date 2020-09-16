import {Collection} from './collection';

/**
 * This class can be used as values for properties in features returned by a backend.
 * SOFP will formulate links 
 **/
export class PropertyReference {
    type : string = 'Feature';
    collection : Collection | string;
    id : string;

    constructor(collection : Collection | string, id: string) {
        this.collection = collection;
        this.id = id;
    }
}