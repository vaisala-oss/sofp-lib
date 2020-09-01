import { Feature } from './feature';
import { Collection } from './collection';
import { Filter } from './filter';

import * as express from 'express';


export interface AuthorizerProvider {
    /**
     * Create an authorizer to be used for feature streams / getFeatureById for
     * this particular request. The returned authorizer should not be reused or
     * used across express requests.
     **/
    createAuthorizer(req : express.Request, collection : Collection) : Promise<Authorizer>;
}

export abstract class Authorizer implements Filter {
    filterClass : string = 'Authorizer';
    query : any = {};
    parameters : any = {};

    abstract accept(feature : Feature) : boolean;
}