import {Filter} from './';

export interface Query {
    limit : Number;
    nextToken : String;
    filters : Filter[];
};
