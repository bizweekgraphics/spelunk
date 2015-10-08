require( 'source-map-support' ).install();

var spelunk, fs, path, assert, FIXTURES, EXPECTED, tests, runTest;

spelunk = require( '..' );
fs = require( 'fs' );
path = require( 'path' );
assert = require( 'assert' );

FIXTURES = path.resolve( __dirname, 'fixtures' );
EXPECTED = path.resolve( __dirname, 'expected' );

var tests = [
	{
		id: 'test_01',
		message: 'should create a valid but empty JSON file'
	},

	{
		id: 'test_02',
		message: 'should create a JSON file with two properties'
	},

	{
		id: 'test_03',
		message: 'should create a JSON file containing an array'
	},

	{
		id: 'test_04',
		message: 'should ignore the README file, as specified',
		options: {
			exclude: '**/README.md'
		}
	},

	{
		id: 'test_05',
		message: 'should ignore trailing slash on root property'
	},

	{
		id: 'test_06',
		message: 'should create an object with an `array` member that is an array',
		options: {
			exclude: '**/README.md'
		}
	},

	{
		id: 'test_07',
		message: 'should retain file extensions',
		options: {
			keepExtensions: true
		}
	}
];

// sync tests
tests.forEach( function ( test ) {
	var actual = spelunk.sync( path.join( FIXTURES, test.id ), test.options );
	var expected = require( path.resolve( EXPECTED, test.id + '.json' ) );

	assert.deepEqual( actual, expected, test.message );

	process.stdout.write( '.' );
});

function runAsyncTest () {
	var test = tests.shift();

	if ( !test ) {
		process.stdout.write( 'all tests passed\n' );
		return; // finito
	}

	process.stdout.write( '.' );

	spelunk( path.resolve( FIXTURES, test.id ), test.options, function ( err, actual ) {
		var expected;

		if ( err ) {
			console.error( err );
		}

		expected = require( path.resolve( EXPECTED, test.id + '.json' ) );

		assert.deepEqual( actual, expected, test.message );

		runAsyncTest();
	});
};

runAsyncTest();
