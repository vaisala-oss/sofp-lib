import {Feature} from './';

export interface Filter {
    /**
     * Unique name for this type of filter
     **/
    filterClass : string;

    /**
     * This filter as a query string ('foo=bar')
     **/
    asQuery : string;
    
    /**
     * Parameters for the filter, these can be used in backends when filters are used in the backend to
     * for example produce SQL where parameters.
     **/
    parameters : object;

    /**
     * Synchronous function to determine whether a feature is accepted by the filter
     **/
    accept(feature : Feature) : boolean;
};
