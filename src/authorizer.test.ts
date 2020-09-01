import { AuthorizerProvider, Authorizer } from './authorizer';
import {Feature, FeatureStream, Item} from './';

class MockAuthorizer extends Authorizer {
    authFn : (f : Feature) => boolean;

    constructor(authFn : (f : Feature) => boolean) {
        super();
        this.authFn = authFn;
    }

    accept(feature : Feature) : boolean {
        return this.authFn(feature);
    }
}

test('Test stream with 2 features (ouf of which 1 authorized), then end-of-stream', done => {

    var fs = new FeatureStream();

    fs.remainingFilter.push(new MockAuthorizer((f : Feature) => f.properties.acceptMe));

    var mockFeature1 : Feature = { properties: { acceptMe: false }, geometry: null };
    var mockFeature2 : Feature = { properties: { acceptMe: true }, geometry: null };

    var dataCall = 0;
    fs.on('data', function(obj : Item) {
        dataCall++;
        expect(dataCall).toBe(1);
        expect(obj.feature).toBe(mockFeature2);
    });

    fs.on('end', function() {
        expect(dataCall).toBe(1);
        done();
    });

    expect(fs.push({ feature: mockFeature1, nextToken: 'a' })).toBe(false);
    expect(fs.push({ feature: mockFeature2, nextToken: 'b' })).toBe(true);
    expect(fs.push(null)).toBe(false);
});
