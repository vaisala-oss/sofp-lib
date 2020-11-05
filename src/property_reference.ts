import {Collection} from './collection';

/**
 * This class can be used as values for properties in features returned by a backend.
 * SOFP will formulate links to other items. Each link should define the collection
 * (either a Collection or the id as a string) and the id of the item. Optionally, if
 * the item resides in another instance of SOFP running parallel (same host) on the same
 * host, a basePath to the other SOFP can be declared.
 **/
export class PropertyReference {
    type : string = 'Feature';
    collection : Collection | string;
    id : string;
    basePath : string | undefined;

    constructor(collection : Collection | string, id: string, basePath?: string) {
        this.collection = collection;
        this.id = id;
        this.basePath = basePath;
    }
}