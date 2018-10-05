import {Feature, Filter} from './';
import {Readable} from 'stream';

export class FeatureStream extends Readable {
    constructor() {
        super({ objectMode: true, read: () => {} });
    }

    /**
     * Add feature to stream.
     *
     * @returns false if the filter does not accept the feature
     **/
    push(feature : any) : boolean {
        if (feature !== null && feature !== undefined) {
            for (var i = 0; i < this.remainingFilter.length; i++) {
                if (!this.remainingFilter[i].accept(feature)) {
                    return false;
                }
            }
        }
        return super.push(feature);
    }

    /**
     * Array of filters that the backend was unable to pass over to the actual data storage. The stream
     * will only accept features that are accepted by all remaining filters.
     *
     * @see push
     **/
    remainingFilter : Filter[] = [];
}