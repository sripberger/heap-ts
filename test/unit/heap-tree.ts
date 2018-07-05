import { expect } from 'chai';
import * as sinon from 'sinon';
import HeapTree from '../../lib/heap-tree';
import * as utils from '../../lib/utils';

describe('HeapTree', function() {
	it('extends Array', function() {
		expect(new HeapTree()).to.be.an.instanceof(Array);
	});

	describe('#getSmallerChildIndex', function() {
		let tree: HeapTree<string>;
		let compare: sinon.SinonStub;
		let getChildIndexes: sinon.SinonStub;

		beforeEach(function() {
			tree = new HeapTree('A', 'B', 'C');
			compare = sinon.stub();
			getChildIndexes = sinon.stub(utils, 'getChildIndexes');
			getChildIndexes.returns([ 1, 2 ]);
		});

		it('invokes compare with child items', function() {
			tree.getSmallerChildIndex(2, compare);

			expect(getChildIndexes).to.be.calledOnce;
			expect(getChildIndexes).to.be.calledWith(2);
			expect(compare).to.be.calledOnce;
			expect(compare).to.be.calledWith('B', 'C');
		});

		it('returns left child if it is smaller', function() {
			compare.returns(-1);

			expect(tree.getSmallerChildIndex(0, compare)).to.equal(1);
		});

		it('return right child if it is smaller', function() {
			compare.returns(1);

			expect(tree.getSmallerChildIndex(0, compare)).to.equal(2);
		});

		it('returns left child if children are equal', function() {
			compare.returns(0);

			expect(tree.getSmallerChildIndex(0, compare)).to.equal(1);
		});

		it('returns left child if there is no right child', function() {
			tree = new HeapTree('A', 'B');

			let result = tree.getSmallerChildIndex(0, compare);

			expect(compare).to.not.be.called;
			expect(result).to.equal(1);
		});

		it('returns null if there are no children', function() {
			tree = new HeapTree('A');

			let result = tree.getSmallerChildIndex(0, compare);

			expect(compare).to.not.be.called;
			expect(result).to.be.null;
		});
	});

	describe('#siftUpOnce', function() {
		let tree: HeapTree<string>;
		let compare: sinon.SinonStub;
		let getParentIndex: sinon.SinonStub;

		beforeEach(function() {
			tree = new HeapTree('A', 'B', 'C', 'D');
			compare = sinon.stub();
			getParentIndex = sinon.stub(utils, 'getParentIndex');
			getParentIndex.returns(0);
		});

		it('compares item at index with its parent', function() {
			tree.siftUpOnce(3, compare);

			expect(getParentIndex).to.be.calledOnce;
			expect(getParentIndex).to.be.calledWith(3);
			expect(compare).to.be.calledOnce;
			expect(compare).to.be.calledWith('D', 'A');
		});

		it('swaps item with parent and returns new index if parent is larger', function() {
			compare.returns(-1);

			let result = tree.siftUpOnce(3, compare);

			expect(tree).to.deep.equal([ 'D', 'B', 'C', 'A' ]);
			expect(result).to.equal(0);
		});

		it('returns null without changing tree if parent is equal', function() {
			compare.returns(0);

			let result = tree.siftUpOnce(3, compare);

			expect(tree).to.deep.equal([ 'A', 'B', 'C', 'D' ]);
			expect(result).to.be.null;
		});

		it('returns null without changing tree if parent is smaller', function() {
			compare.returns(1);

			let result = tree.siftUpOnce(3, compare);

			expect(tree).to.deep.equal([ 'A', 'B', 'C', 'D' ]);
			expect(result).to.be.null;
		});

		it('returns null without comparing if there is no parent', function() {
			getParentIndex.returns(null);

			let result = tree.siftUpOnce(3, compare);

			expect(compare).to.not.be.called;
			expect(tree).to.deep.equal([ 'A', 'B', 'C', 'D' ]);
			expect(result).to.be.null;
		});
	});

	describe('#siftDownOnce', function() {
		let tree: HeapTree<string>;
		let compare: sinon.SinonStub;
		let getSmallerChildIndex: sinon.SinonStub;

		beforeEach(function() {
			tree = new HeapTree('A', 'B', 'C', 'D');
			compare = sinon.stub();
			getSmallerChildIndex = sinon.stub(tree, 'getSmallerChildIndex');
			getSmallerChildIndex.returns(3);
		});

		it('compares item with its smaller child', function() {
			tree.siftDownOnce(1, compare);

			expect(getSmallerChildIndex).to.be.calledOnce;
			expect(getSmallerChildIndex).to.be.calledOn(tree);
			expect(getSmallerChildIndex).to.be.calledWith(1, compare);
			expect(compare).to.be.calledOnce;
			expect(compare).to.be.calledWith('B', 'D');
		});

		it('swaps item with child and returns new index if child is smaller', function() {
			compare.returns(1);

			let result = tree.siftDownOnce(1, compare);

			expect(tree).to.deep.equal([ 'A', 'D', 'C', 'B' ]);
			expect(result).to.equal(3);
		});

		it('returns null without changing tree if child is equal', function() {
			compare.returns(0);

			let result = tree.siftDownOnce(1, compare);

			expect(tree).to.deep.equal([ 'A', 'B', 'C', 'D' ]);
			expect(result).to.be.null;
		});

		it('returns null without changing tree if child is larger', function() {
			compare.returns(-1);

			let result = tree.siftDownOnce(1, compare);

			expect(tree).to.deep.equal([ 'A', 'B', 'C', 'D' ]);
			expect(result).to.be.null;
		});

		it('returns null without comparing if there are no children', function() {
			getSmallerChildIndex.returns(null);

			let result = tree.siftDownOnce(1, compare);

			expect(compare).to.not.be.called;
			expect(result).to.be.null;
		});
	});

	describe('#siftUp', function() {
		it('invokes siftUpOnce with each new index until it returns null', function() {
			let tree = new HeapTree();
			let compare = () => {};
			let siftUpOnce = sinon.stub(tree, 'siftUpOnce')
				.onFirstCall().returns(1)
				.onSecondCall().returns(0)
				.onThirdCall().returns(null);

			tree.siftUp(3, compare);

			expect(siftUpOnce).to.be.calledThrice;
			expect(siftUpOnce).to.always.be.calledOn(tree);
			expect(siftUpOnce.firstCall).to.be.calledWith(3, compare);
			expect(siftUpOnce.secondCall).to.be.calledWith(1, compare);
			expect(siftUpOnce.thirdCall).to.be.calledWith(0, compare);
		});
	});

	describe('#siftDown', function() {
		it('invokes siftDownOnce with each new index until it returns null', function() {
			let tree = new HeapTree();
			let compare = () => {};
			let siftDownOnce = sinon.stub(tree, 'siftDownOnce')
				.onFirstCall().returns(1)
				.onSecondCall().returns(3)
				.onThirdCall().returns(null);

			tree.siftDown(0, compare);

			expect(siftDownOnce).to.be.calledThrice;
			expect(siftDownOnce).to.always.be.calledOn(tree);
			expect(siftDownOnce.firstCall).to.be.calledWith(0, compare);
			expect(siftDownOnce.secondCall).to.be.calledWith(1, compare);
			expect(siftDownOnce.thirdCall).to.be.calledWith(3, compare);
		});
	});

	describe('#prePop', function() {
		it('replaces top with bottom, returning original top', function() {
			let tree = new HeapTree('A', 'B', 'C');

			let result = tree.prePop();

			expect(tree).to.deep.equal(['C', 'B']);
			expect(result).to.equal('A');
		});

		it('correctly handles single remaining element', function() {
			let tree = new HeapTree('A');

			let result = tree.prePop();

			expect(tree).to.be.empty;
			expect(result).to.equal('A');
		});

		it('returns null if tree is empty', function() {
			let tree = new HeapTree();

			let result = tree.prePop();

			expect(tree).to.be.empty;
			expect(result).to.be.null;
		});

		it('correctly handles undefined as an item', function() {
			let tree = new HeapTree('A', undefined);

			let result = tree.prePop();

			expect(tree).to.deep.equal([ undefined ]);
			expect(result).to.equal('A');
		});
	});

	describe('#replaceTop', function() {
		it('replaces top with the provided item and returns top', function() {
			let tree = new HeapTree('A', 'B');

			let result = tree.replaceTop('C');

			expect(tree).to.deep.equal([ 'C', 'B' ]);
			expect(result).to.equal('A');
		});

		it('returns provided item without changing tree if tree is empty', function() {
			let tree = new HeapTree();

			let result = tree.replaceTop('A');

			expect(tree).to.be.empty;
			expect(result).to.equal('A');
		});
	});
});
