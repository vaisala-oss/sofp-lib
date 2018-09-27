import {Feature, Filter} from './';

export interface FeatureCursor {
    hasNext() : boolean;
    next() : Feature;
    remainingFilter : Filter[];
};

