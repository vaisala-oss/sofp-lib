import {Filter} from './';

export interface Query {
    limit : number;
    nextToken : string;
    
    /**
     * Filter as parsed from the query. Backends should never modify the filter array or the contents.
     */
    filters : Filter[];
};
