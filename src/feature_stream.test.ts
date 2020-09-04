import {Feature, FeatureStream, Item} from './';

test('Test stream with 1 object, then end-of-stream', done => {
    var fs = new FeatureStream();

    var mockFeature : Feature = { properties: { data: 'yes' }, geometry: null };

    var dataCall = 0;
    fs.on('data', function(obj : Item) {
        dataCall++;
        expect(dataCall).toBe(1);
        expect(obj.feature).toBe(mockFeature);
    });

    fs.on('end', function() {
        expect(dataCall).toBe(1);
        done();
    });

    expect(fs.push({ feature: mockFeature, nextToken: 'xxx' })).toBe(true);
    expect(fs.lastPushedItem && fs.lastPushedItem.nextToken).toBe('xxx');
    expect(fs.push(null)).toBe(false);
    expect(fs.lastPushedItem && fs.lastPushedItem.nextToken).toBe('xxx');
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
    expect(fs.lastPushedItem).toBeNull();
});

test('Test stream with 2 objects in, 2 out, then end-of-stream', done => {
    var fs = new FeatureStream();

    var mockFeature1 : Feature = { properties: { foo: false }, geometry: null };
    var mockFeature2 : Feature = { properties: { foo: true }, geometry: null };

    var dataCall = 0;
    fs.on('data', function(obj : Item) {
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
    expect(fs.lastPushedItem && fs.lastPushedItem.nextToken).toBe('a');
    expect(fs.push({ feature: mockFeature2, nextToken: 'b' })).toBe(true);
    expect(fs.lastPushedItem && fs.lastPushedItem.nextToken).toBe('b');
    expect(fs.push(null)).toBe(false);
    expect(fs.lastPushedItem && fs.lastPushedItem.nextToken).toBe('b');
});



test('Test stream with 2 objects in, 1 out (1 filtered), then end-of-stream', done => {
    var fs = new FeatureStream();

    fs.remainingFilter.push({
        filterClass: 'mockFilter',
        query: {},
        parameters: {},
        accept: (feature : Feature) => { return feature.properties['acceptMe']; }
    });

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
    expect(fs.lastPushedItem && fs.lastPushedItem.nextToken).toBe('a');
    expect(fs.push({ feature: mockFeature2, nextToken: 'b' })).toBe(true);
    expect(fs.lastPushedItem && fs.lastPushedItem.nextToken).toBe('b');
    expect(fs.push(null)).toBe(false);
    expect(fs.lastPushedItem && fs.lastPushedItem.nextToken).toBe('b');
});

test('Test stream error handling (pushing error)', done => {
    var fs = new FeatureStream();

    var mockFeature1 : Feature = { properties: { acceptMe: false }, geometry: null };
    var error : any;
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
    expect(fs.lastPushedItem && fs.lastPushedItem.nextToken).toBe('a');
    // The error is "accepted"
    expect(fs.push(new Error('Something bad happened'))).toBe(true);
    // Pushing more features is expected to fail
    expect(fs.push({ feature: mockFeature1, nextToken: 'b' })).toBe(false);
    expect(fs.lastPushedItem && fs.lastPushedItem.nextToken).toBe('a');
});

test('Test stream end handling (pushing null)', done => {
    var fs = new FeatureStream();

    var mockFeature1 : Feature = { properties: { acceptMe: false }, geometry: null };
    var error : any;
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
        expect(error.message).toBe('stream.push() after EOF');
        done();
    });

    // Item containing a mock feature should be accepted
    expect(fs.push({ feature: mockFeature1, nextToken: 'a' })).toBe(true);
    expect(fs.lastPushedItem && fs.lastPushedItem.nextToken).toBe('a');
    // The EOF is "not accepted"
    expect(fs.push(null)).toBe(false);
    // Pushing more features is expected to fail
    expect(fs.push({ feature: mockFeature1, nextToken: 'b' })).toBe(false);
    expect(fs.lastPushedItem && fs.lastPushedItem.nextToken).toBe('a');
});

test('Test stream end handling (pushing item with null feature)', done => {
    var fs = new FeatureStream();

    var mockFeature1 : Feature = { properties: { acceptMe: false }, geometry: null };
    var error : any;
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
        expect(error.message).toBe('stream.push() after EOF');
        done();
    });

    // Item containing a mock feature should be accepted
    expect(fs.push({ feature: mockFeature1, nextToken: 'a' })).toBe(true);
    expect(fs.lastPushedItem && fs.lastPushedItem.nextToken).toBe('a');
    // The EOF is "not accepted"
    expect(fs.push({ feature: null, nextToken: 'c' })).toBe(false);
    expect(fs.lastPushedItem && fs.lastPushedItem.nextToken).toBe('c');
    // Pushing more features is expected to fail
    expect(fs.push({ feature: mockFeature1, nextToken: 'b' })).toBe(false);
    expect(fs.lastPushedItem && fs.lastPushedItem.nextToken).toBe('c');
});
