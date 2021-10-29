import {Collection, Link} from './';

export class Backend {
    name : string;

    constructor(name : string) {
        this.name = name;
        this.links = {
            collections: []
        };
    }

    collections : Collection[] = [];
    links: {
        collections: Link[]
    }
};
