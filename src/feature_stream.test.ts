import {FeatureStream} from './feature_stream';


test('Test stream with 1 object, then end-of-stream', done => {
    var fs = new FeatureStream();

    var mockObject = { data: 'yes' };

    var dataCall = 0;
    fs.on('data', function(obj) {
        dataCall++;
        expect(dataCall).toBe(1);
        expect(obj).toBe(mockObject);
    });

    fs.on('end', function() {
        expect(dataCall).toBe(1);
        done();
    });

    expect(fs.push(mockObject)).toBe(true);
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

    var mockObject1 = { properties: { foo: false } };
    var mockObject2 = { properties: { foo: true } };

    var dataCall = 0;
    fs.on('data', function(obj) {
        dataCall++;
        expect(dataCall < 3).toBe(true);
        if (dataCall == 1) {
            expect(obj).toBe(mockObject1);
        } else {
            expect(obj).toBe(mockObject2);
        }
    });

    fs.on('end', function() {
        expect(dataCall).toBe(2);
        done();
    });

    expect(fs.push(mockObject1)).toBe(true);
    expect(fs.push(mockObject2)).toBe(true);
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

    var mockObject1 = { properties: { acceptMe: false } };
    var mockObject2 = { properties: { acceptMe: true } };

    var dataCall = 0;
    fs.on('data', function(obj) {
        dataCall++;
        expect(dataCall).toBe(1);
        expect(obj).toBe(mockObject2);
    });

    fs.on('end', function() {
        expect(dataCall).toBe(1);
        done();
    });

    expect(fs.push(mockObject1)).toBe(false);
    expect(fs.push(mockObject2)).toBe(true);
    expect(fs.push(null)).toBe(false);
});

