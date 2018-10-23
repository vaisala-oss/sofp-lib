import {Feature, FeatureStream, Link, Query} from './';

/**
 * Interface for objects representing WFS 3.0 collections
 * @link https://raw.githubusercontent.com/opengeospatial/WFS_FES/master/core/openapi/schemas/collectionInfo.yaml
 **/
export interface Collection {
    name : string;
    title? : string;
    description? : string;

    /**
     * Any non-protocol links for the collection. For example links to additional information etc. The
     * API will produce the links required for access any data in this collection.
     **/
    links : Link[];

    extent? : string;
    crs? : string;

    /**
     * This function performs the query at the data store that contains the data for this collection.
     * The implementation is responsible for the following:
     *  - the function shall return a new FeatureStream instance
     *  - query filters are translated into parameters for the data store request (Filter.featureClass
     *    is used to identify filters)
     *  - any query filters that cannot be translated fully are stored as an array remainingFilter in
     *    the returned object
     *  - query.nextToken shall indicate the position to start processing features from the data store
     *  - each feature retrieved from the data store is push()'ed into the FeatureStream along with the
     *    nextToken that would start this retrieval process from the following item
     *  - features are pushed in the FeatureStream until
     *       a) the FeatureStream has accepted (=push() return value is truthy) query.limit number of
     *          items, or
     *       b) no more items in the data store matching the query
     *  - to end this page of features, null is pushed to the FeatureStream
     *
     **/
    executeQuery(query : Query) : FeatureStream;

    getFeatureById(id : string) : Promise<Feature>;
};