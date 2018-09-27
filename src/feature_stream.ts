import {Feature, Filter} from './';
import {Readable} from 'stream';

export class FeatureStream extends Readable {
    constructor() {
        super({ objectMode: true, read: () => {} });
    }
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
    remainingFilter : Filter[] = [];
}