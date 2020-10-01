import {Feature} from './';

/**
 * Internal class used when collections push data to FeatureStreams.
 *
 * nextToken refers to paging. The nextToken of the last feature to be
 * ingested by the stream will be used by the client in the next link.
 * A nextToken can also be supplied with the end-of-stream Item where
 * feature == null. If nextToken is null, then this page is considered
 * the last one. A nextToken may be a string or a function returning
 * a promise that resolves into a string. The latter is used in cases
 * where resolving the nextToken takes extra resources or requires
 * computation.
 */
export interface Item {
    feature : Feature | null;
    nextToken : string | (() => Promise<string>) | null;
};