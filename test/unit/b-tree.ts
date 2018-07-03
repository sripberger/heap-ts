import { expect } from 'chai';
import * as sinon from 'sinon';
import BTree from '../../lib/b-tree';
import * as utils from '../../lib/utils';

describe('BTree', function() {
	it('extends Array', function() {
		expect(new BTree()).to.be.an.instanceof(Array);
	});

	describe('#getSmallerChildIndex', function() {
		let btree: BTree<string>;
		let compare: sinon.SinonStub;
		let getChildIndexes: sinon.SinonStub;

		beforeEach(function() {
			btree = new BTree<string>('A', 'B', 'C');
			compare = sinon.stub();
			getChildIndexes = sinon.stub(utils, 'getChildIndexes');
			getChildIndexes.returns([ 1, 2 ]);
		});

		it('invokes compare with child items', function() {
			btree.getSmallerChildIndex(0, compare);

			expect(getChildIndexes).to.be.calledOnce;
			expect(getChildIndexes).to.be.calledWith(0);
			expect(compare).to.be.calledOnce;
			expect(compare).to.be.calledWith('B', 'C');
		});

		it('returns left child if it is smaller', function() {
			compare.returns(-1);

			expect(btree.getSmallerChildIndex(0, compare)).to.equal(1);
		});

		it('return right child if it is smaller', function() {
			compare.returns(1);

			expect(btree.getSmallerChildIndex(0, compare)).to.equal(2);
		});

		it('returns left child if children are equal', function() {
			compare.returns(0);

			expect(btree.getSmallerChildIndex(0, compare)).to.equal(1);
		});

		it('returns left child if there is no right child', function() {
			btree = new BTree('A', 'B');

			let result = btree.getSmallerChildIndex(0, compare);

			expect(compare).to.not.be.called;
			expect(result).to.equal(1);
		});

		it('returns null if there are no children', function() {
			btree = new BTree('A');

			let result = btree.getSmallerChildIndex(0, compare);

			expect(compare).to.not.be.called;
			expect(result).to.be.null;
		});
	});
});
