import { expect } from 'chai';
import * as sinon from 'sinon';
import Heap from '../../lib/heap';
import HeapTree from '../../lib/heap-tree';
import * as utils from '../../lib/utils';

describe('Heap', function() {
	it('stores provided compare function', function() {
		let compare = () => {};

		let heap = new Heap<string>(compare);

		expect(heap.compare).to.equal(compare);
	});

	it('defaults to utils::defaultCompare', function() {
		let heap = new Heap<string>();

		expect(heap.compare).to.equal(utils.defaultCompare);
	});

	it('creates and stores a new HeapTree', function() {
		let heap = new Heap<string>();

		expect(heap.tree).to.be.an.instanceof(HeapTree);
		expect(heap.tree).to.be.empty;
	});

	describe('#push', function() {
		it('appends to the tree, then sifts up from the bottom', function() {
			let heap = new Heap<string>();
			let siftUp = sinon.stub(heap.tree, 'siftUp');
			heap.tree.push('A', 'B');

			heap.push('C');

			expect(heap.tree).to.deep.equal([ 'A', 'B', 'C' ]);
			expect(siftUp).to.be.calledOnce;
			expect(siftUp).to.be.calledOn(heap.tree);
			expect(siftUp).to.be.calledWith(2, heap.compare);
		});
	});

	describe('#pop', function() {
		it('invokes tree.prePop, sifts down from the top, then returns prePop result', function() {
			let heap = new Heap<string>();
			let prePop = sinon.stub(heap.tree, 'prePop').returns('foo');
			let siftDown = sinon.stub(heap.tree, 'siftDown');

			let result = heap.pop();

			expect(prePop).to.be.calledOnce;
			expect(prePop).to.be.calledOn(heap.tree);
			expect(siftDown).to.be.calledOnce;
			expect(siftDown).to.be.calledOn(heap.tree);
			expect(siftDown).to.be.calledWith(0, heap.compare);
			expect(siftDown).to.be.calledAfter(prePop);
			expect(result).to.equal('foo');
		});
	});
});
