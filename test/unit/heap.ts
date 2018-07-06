import { expect } from 'chai';
import * as sinon from 'sinon';
import Heap from '../../lib/heap';
import HeapTree from '../../lib/heap-tree';
import * as utils from '../../lib/utils';

describe('Heap', function() {
	let compare: Function;
	let heap: Heap<string>;

	beforeEach(function() {
		compare = () => {};
		heap = new Heap<string>(compare);
	});

	it('stores provided compare function', function() {
		expect(heap.compare).to.equal(compare);
	});

	it('defaults to utils::defaultCompare', function() {
		expect(new Heap<string>().compare).to.equal(utils.defaultCompare);
	});

	it('creates and stores a new HeapTree', function() {
		expect(heap.tree).to.be.an.instanceof(HeapTree);
		expect(heap.tree).to.be.empty;
	});

	describe('#push', function() {
		it('appends to the tree, then sifts up from the bottom', function() {
			let siftUp = sinon.stub(heap.tree, 'siftUp');
			heap.tree.push('A', 'B');

			heap.push('C');

			expect(heap.tree).to.deep.equal([ 'A', 'B', 'C' ]);
			expect(siftUp).to.be.calledOnce;
			expect(siftUp).to.be.calledOn(heap.tree);
			expect(siftUp).to.be.calledWith(2, compare);
		});
	});

	describe('#pop', function() {
		it('sifts down from the top after tree.prePop, returning result', function() {
			let prePop = sinon.stub(heap.tree, 'prePop').returns('A');
			let siftDown = sinon.stub(heap.tree, 'siftDown');

			let result = heap.pop();

			expect(prePop).to.be.calledOnce;
			expect(prePop).to.be.calledOn(heap.tree);
			expect(siftDown).to.be.calledOnce;
			expect(siftDown).to.be.calledOn(heap.tree);
			expect(siftDown).to.be.calledWith(0, compare);
			expect(siftDown).to.be.calledAfter(prePop);
			expect(result).to.equal('A');
		});
	});

	describe('#pushPop', function() {
		it('sifts down from top after tree.replaceTop, returning result', function() {
			let replaceTop = sinon.stub(heap.tree, 'replaceTop').returns('A');
			let siftDown = sinon.stub(heap.tree, 'siftDown');

			let result = heap.pushPop('B');

			expect(replaceTop).to.be.calledOnce;
			expect(replaceTop).to.be.calledOn(heap.tree);
			expect(replaceTop).to.be.calledWith('B', compare);
			expect(siftDown).to.be.calledOnce;
			expect(siftDown).to.be.calledOn(heap.tree);
			expect(siftDown).to.be.calledWith(0, compare);
			expect(siftDown).to.be.calledAfter(replaceTop);
			expect(result).to.equal('A');
		});
	});

	describe('#update', function() {
		it('invokes tree.update at index of provided item', function() {
			let update = sinon.stub(heap.tree, 'update');
			heap.tree.push('A', 'B', 'C');

			heap.update('B');

			expect(update).to.be.calledOnce;
			expect(update).to.be.calledOn(heap.tree);
			expect(update).to.be.calledWith(1, compare);
		});
	});

	describe('#replace', function() {
		it('replaces item with another and updates its position', function() {
			let replace = sinon.stub(heap.tree, 'replace');
			let update = sinon.stub(heap.tree, 'update');
			heap.tree.push('A', 'B', 'C');

			heap.replace('B', 'D');

			expect(replace).to.be.calledOnce;
			expect(replace).to.be.calledOn(heap.tree);
			expect(replace).to.be.calledWith(1, 'D');
			expect(update).to.be.calledOnce;
			expect(update).to.be.calledOn(heap.tree);
			expect(update).to.be.calledWith(1, compare);
			expect(update).to.be.calledAfter(replace);
		});
	});
});
