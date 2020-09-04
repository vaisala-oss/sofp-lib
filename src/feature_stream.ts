import {Filter, Item} from './';
import {Readable} from 'stream';

export class FeatureStream extends Readable {
    constructor() {
        super({ objectMode: true, read: () => {} });
    }

    /**
     * Add feature item to stream. If an error occurs, an instance of Error
     * may be pushed to the stream. An alternative way to pass an Error and
     * close the stream is by calling destroy() with the Error parameter.
     * End of items can be signaled by pushing null or an Item with a null
     * feature. The latter is recommended. It allows the backend to 
     * set the nextToken in cases where the backend does not find any
     * features within the current page of its internal paging.
     *
     * @returns false if the filter does not accept this feature
     **/
    push(item : Item | Error | null) : boolean {
        let previousLastPushedItem = this.lastPushedItem;
        let forceStoringLastItem = false;
        if (item !== null && item !== undefined) {
            if (item instanceof Error) {
                this.destroy(item);
                return true;
            }
            
            this.lastPushedItem = item;
            if (item.feature === null) {
                // Overwrite item to be pushed as null => will close stream
                item = null;
                forceStoringLastItem = true;
            } else {
                for (var i = 0; i < this.remainingFilter.length; i++) {
                    if (!this.remainingFilter[i].accept(item.feature)) {
                        return false;
                    }
                }
            }
        }
        let ret = super.push(item);
        // If super does not accept the item => stream is closed, reset last pushed item
        if (!ret && !forceStoringLastItem) {
            this.lastPushedItem = previousLastPushedItem;
        }
        return ret;
    }

    /**
     * Array of filters that the backend was unable to pass over to the actual data storage. The stream
     * will only accept features that are accepted by all remaining filters.
     *
     * @see push
     **/
    remainingFilter : Filter[] = [];

    /**
     * CRS of the features in the stream in URL format. For example 'http://www.opengis.net/def/crs/EPSG/0/3067'
     **/
    crs : String | null = null;

    /**
     * The last item that the backend pushed to the stream. Note that this item might or might
     * not be accepted by the remainingFilter. This is used to determine the nextToken for
     * the next page of results.
     **/
    lastPushedItem : Item | null = null;
}