import {Filter, Item} from './';
import {Readable} from 'stream';

export class FeatureStream extends Readable {
    constructor() {
        super({ objectMode: true, read: () => {} });
    }

    /**
     * Add feature item to stream.
     *
     * @returns false if the filter does not accept this feature
     **/
    push(item : Item) : boolean {
        if (item !== null && item !== undefined) {
            for (var i = 0; i < this.remainingFilter.length; i++) {
                if (!this.remainingFilter[i].accept(item.feature)) {
                    return false;
                }
            }
        }
        return super.push(item);
    }

    /**
     * Array of filters that the backend was unable to pass over to the actual data storage. The stream
     * will only accept features that are accepted by all remaining filters.
     *
     * @see push
     **/
    remainingFilter : Filter[] = [];
}