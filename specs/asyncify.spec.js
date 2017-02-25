const asyncify = require( "../index" );

const goodCallback = ( p1, cb ) => {
	cb( null, `${ p1 }-asyncified` );
};

const badCallback = ( p1, cb ) => {
	cb( new Error( "it blowed up" ) );
};

describe( "asyncify tests", () => {
	it( "should return an AsyncFunction", () => {
		const f = asyncify( goodCallback );
		f.should.be.an( "AsyncFunction" );
		return f( "yes" ).then( res => {
			res.should.equal( "yes-asyncified" );
		} );
	} );

	it( "should act as a promise", () => {
		const f = asyncify( goodCallback );
		return f( "yes" ).then( res => {
			res.should.equal( "yes-asyncified" );
		} );
	} );

	it( "should return function with asyncified name", () => {
		const f = asyncify( goodCallback );
		f.name.should.equal( "asyncGoodCallback" );
	} );

	it( "should return anonymous function with asyncAnonymous name", () => {
		const f = asyncify( ( cb ) => cb( null, "hey" ) );
		f.name.should.equal( "asyncAnonymous" );
	} );

	it( "should reject with an error", () => {
		const f = asyncify( badCallback );
		return f( "yes" )
			.then( res => {
				res = "what?!";
				should.not.exist( res );
			}, err => {
				should.exist( err );
			} );
	} );

	it( "should catch an error", () => {
		let err = null;
		let res = null;

		const f = asyncify( badCallback );

		const tryF = async () => {
			try {
				await f( 1 );
				res = "what?!";
			} catch ( e ) {
				err = e;
			}
		};

		return tryF().then( () => {
			should.not.exist( res );
			should.exist( err );
		} );
	} );

	it( "should return same AsyncFunction", () => {
		const asyncf = async () => {
			return "async!";
		};
		const f = asyncify( asyncf );

		f.should.be.an( "AsyncFunction" );
		f.name.should.equal( "asyncf" );
	} );

	it( "should execute callback with no args", () => {
		const callBackNoArgs = cb => {
			cb( null, "here's yer callback" );
		};
		const f = asyncify( callBackNoArgs );
		return f().then( res => {
			res.should.equal( "here's yer callback" );
		} );
	} );

	it( "should execute callback with obj literal", () => {
		const callBackF = ( obj, cb ) => {
			cb( null, `your ${ obj.title }` );
		};
		const f = asyncify( callBackF );
		return f( { title: "beardiness" } ).then( res => {
			res.should.equal( "your beardiness" );
		} );
	} );

	it( "should execute callback with array", () => {
		const callBackF = ( arr, cb ) => {
			cb( null, `hello ${ arr[ 1 ] }` );
		};
		const f = asyncify( callBackF );
		return f( [ "john", "david", "smith" ] ).then( res => {
			res.should.equal( "hello david" );
		} );
	} );

	it( "should execute callback with multiple args", () => {
		const callBackF = ( x, y, z, cb ) => {
			cb( null, x + y + z );
		};
		const f = asyncify( callBackF );
		return f( "a", "b", "c" ).then( res => {
			res.should.equal( "abc" );
		} );
	} );

	it( "should execute callback with destructured args", () => {
		const callBackF = ( { x, y, z }, cb ) => {
			cb( null, x + y + z );
		};
		const f = asyncify( callBackF );
		return f( { x: "a", y: "b", z: "c" } ).then( res => {
			res.should.equal( "abc" );
		} );
	} );

	it( "should return multiple values as array", () => {
		const callBackF = ( { x, y, z }, cb ) => {
			cb( null, x, y, z );
		};
		const f = asyncify( callBackF );
		return f( { x: "a", y: "b", z: "c" } ).then( res => {
			res.should.deep.equal( [ "a", "b", "c" ] );
		} );
	} );
} );
