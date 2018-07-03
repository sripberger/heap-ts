import { expect } from 'chai';
import sinon from 'sinon';

describe('Asdf', function() {
	it('does the thing', function() {
		expect(true).to.be.false;
	});

	it('does the other thing', function() {
		let fn = sinon.stub();

		fn();

		expect(fn).to.be.calledOnce;
	});

	it('does more things', function() {
		let asdf:string = sinon;
	});
});
