import {Feature} from './feature';
import {FeatureStream} from './feature_stream';


test('Test stream with 1 object, then end-of-stream', done => {
    var fs = new FeatureStream();

    var mockFeature : Feature = { properties: { data: 'yes' }, geometry: null };

    var dataCall = 0;
    fs.on('data', function(obj) {
        dataCall++;
        expect(dataCall).toBe(1);
        expect(obj.feature).toBe(mockFeature);
    });

    fs.on('end', function() {
        expect(dataCall).toBe(1);
        done();
    });

    expect(fs.push({ feature: mockFeature, nextToken: null })).toBe(true);
    expect(fs.push(null)).toBe(false);
});

test('Test stream with 0 objects, just end-of-stream', done => {
    var fs = new FeatureStream();

    fs.on('data', function(obj) {
        fail();
    });

    fs.on('end', function() {
        done();
    });

    expect(fs.push(null)).toBe(false);
});

test('Test stream with 2 objects in, 2 out, then end-of-stream', done => {
    var fs = new FeatureStream();

    var mockFeature1 : Feature = { properties: { foo: false }, geometry: null };
    var mockFeature2 : Feature = { properties: { foo: true }, geometry: null };

    var dataCall = 0;
    fs.on('data', function(obj) {
        dataCall++;
        expect(dataCall < 3).toBe(true);
        if (dataCall == 1) {
            expect(obj.feature).toBe(mockFeature1);
        } else {
            expect(obj.feature).toBe(mockFeature2);
        }
    });

    fs.on('end', function() {
        expect(dataCall).toBe(2);
        done();
    });

    expect(fs.push({ feature: mockFeature1, nextToken: 'a' })).toBe(true);
    expect(fs.push({ feature: mockFeature2, nextToken: null })).toBe(true);
    expect(fs.push(null)).toBe(false);
});



test('Test stream with 2 objects in, 1 out (1 filtered), then end-of-stream', done => {
    var fs = new FeatureStream();

    fs.remainingFilter.push({
        filterClass: 'mockFilter',
        asQuery: '',
        parameters: {},
        accept: (feature) => { return feature.properties['acceptMe']; }
    });

    var mockFeature1 : Feature = { properties: { acceptMe: false }, geometry: null };
    var mockFeature2 : Feature = { properties: { acceptMe: true }, geometry: null };

    var dataCall = 0;
    fs.on('data', function(obj) {
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

test('Test stream error handling', done => {
    var fs = new FeatureStream();

    var mockFeature1 : Feature = { properties: { acceptMe: false }, geometry: null };
    var error;
    var featuresReceived = 0;

    fs.on('data', function(obj) {
        featuresReceived++;
    });

    fs.on('error', function(err) {
        error = err;
    });


    fs.on('end', function() {
        expect(featuresReceived).toBe(1);
        expect(error).toBeDefined();
        done();
    });

    // Item containing a mock feature should be accepted
    expect(fs.push({ feature: mockFeature1, nextToken: 'a' })).toBe(true);
    // The error is "accepted"
    expect(fs.push(new Error('Something bad happened'))).toBe(true);
    // Pushing more features is expected to fail
    expect(fs.push({ feature: mockFeature1, nextToken: 'a' })).toBe(false);
});
