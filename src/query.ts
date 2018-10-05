import {Filter} from './';

export interface Query {
    limit : Number;
    skip : Number;
    filters : Filter[];
};
