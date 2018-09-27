import {Feature} from './';

export interface Filter {
    filterClass : string;
    accept(feature : Feature) : boolean;
};
