import {Collection, Link} from './';

export class Backend {
    name : string;

    constructor(name : string) {
        this.name = name;
    }

    collections : Collection[] = [];
    links : Link[] = [];
};
