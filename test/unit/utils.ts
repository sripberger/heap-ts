import { expect } from 'chai';
import * as sinon from 'sinon';
import * as utils from '../../lib/utils';

//         0
//      1     2
//     3 4   5 6
describe('utils', function() {
	describe('::getParentIndex', function() {
		it('returns binary tree parent index of provided index', function() {
			//         0
			//      1     2
			//     3 4   5 6
			expect(utils.getParentIndex(6)).to.equal(2);
			expect(utils.getParentIndex(5)).to.equal(2);
			expect(utils.getParentIndex(4)).to.equal(1);
			expect(utils.getParentIndex(3)).to.equal(1);
			expect(utils.getParentIndex(2)).to.equal(0);
			expect(utils.getParentIndex(1)).to.equal(0);
			expect(utils.getParentIndex(0)).to.be.null;
		});

	});

	describe('::getChildIndexes', function() {
		it('returns binary tree child indices of provided index', function() {
			//             0
			//      1              2
			//    3    4       5      6
			//   7 8  9 10   11 12  13 14
			expect(utils.getChildIndexes(0)).to.deep.equal([ 1, 2 ]);
			expect(utils.getChildIndexes(1)).to.deep.equal([ 3, 4 ]);
			expect(utils.getChildIndexes(2)).to.deep.equal([ 5, 6 ]);
			expect(utils.getChildIndexes(3)).to.deep.equal([ 7, 8 ]);
			expect(utils.getChildIndexes(4)).to.deep.equal([ 9, 10 ]);
			expect(utils.getChildIndexes(5)).to.deep.equal([ 11, 12 ]);
			expect(utils.getChildIndexes(6)).to.deep.equal([ 13, 14 ]);
		});
	});

	describe('::getSmallerChildIndex', function() {
		let items: string[];
		let compare: sinon.SinonStub;
		let getChildIndexes: sinon.SinonStub;

		beforeEach(function() {
			items = [ 'A', 'B', 'C' ];
			compare = sinon.stub();
			getChildIndexes = sinon.stub(utils, 'getChildIndexes');
			getChildIndexes.returns([ 1, 2 ]);
		});

		it('invokes compare with child items', function() {
			utils.getSmallerChildIndex(items, 0, compare);

			expect(getChildIndexes).to.be.calledOnce;
			expect(getChildIndexes).to.be.calledWith(0);
			expect(compare).to.be.calledOnce;
			expect(compare).to.be.calledWith('B', 'C');
		});

		it('returns left child if it is smaller', function() {
			compare.returns(-1);

			expect(utils.getSmallerChildIndex(items, 0, compare)).to.equal(1);
		});

		it('return right child if it is smaller', function() {
			compare.returns(1);

			expect(utils.getSmallerChildIndex(items, 0, compare)).to.equal(2);
		});

		it('returns left child if children are equal', function() {
			compare.returns(0);

			expect(utils.getSmallerChildIndex(items, 0, compare)).to.equal(1);
		});

		it('returns left child if there is no right child', function() {
			items = [ 'A', 'B' ];

			let result = utils.getSmallerChildIndex(items, 0, compare);

			expect(compare).to.not.be.called;
			expect(result).to.equal(1);
		});

		it('returns null if there are no children', function() {
			items = [ 'A' ];

			let result = utils.getSmallerChildIndex(items, 0, compare);

			expect(compare).to.not.be.called;
			expect(result).to.be.null;
		});
	});

	describe('::defaultCompare', function() {
		it('returns -1 if a < b', function() {
			expect(utils.defaultCompare(1, 4)).to.equal(-1);
			expect(utils.defaultCompare('A', 'B')).to.equal(-1);
		});

		it('returns 0 if a == b', function() {
			expect(utils.defaultCompare(2, 2)).to.equal(0);
			expect(utils.defaultCompare('C', 'C')).to.equal(0);
		});

		it('returns 1 if a > b', function() {
			expect(utils.defaultCompare(3, 0)).to.equal(1);
			expect(utils.defaultCompare('E', 'D')).to.equal(1);
		});
	});
});
