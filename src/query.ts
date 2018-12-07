import {Filter} from './';

export interface Query {
    limit : Number;
    nextToken : String;
    
    /**
     * Filter as parsed from the query. Backends should never modify the filter array or the contents.
     */
    filters : Filter[];
};
