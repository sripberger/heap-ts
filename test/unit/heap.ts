import { expect } from 'chai';
import * as sinon from 'sinon';
import Heap from '../../lib/heap';
import HeapTree from '../../lib/heap-tree';
import * as utils from '../../lib/utils';

describe('Heap', function() {
	let compare: CompareFunction<string>;
	let heap: Heap<string>;

	beforeEach(function() {
		compare = (_a:string, _b:string) => 0;
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

	describe('@length', function() {
		it('returns number of items in tree', function() {
			heap.tree.push('A', 'B', 'C');

			expect(heap.length).to.equal(3);
		});
	});

	describe('@isEmpty', function() {
		it('returns true if and only if length is zero', function() {
			let fooHeap = new Heap<string>(compare);
			let barHeap = new Heap<string>(compare);
			fooHeap.tree.push('A');
			barHeap.tree.push('A', 'B');

			expect(heap.isEmpty).to.be.true;
			expect(fooHeap.isEmpty).to.be.false;
			expect(barHeap.isEmpty).to.be.false;
		});
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
		it('sifts down from the top after tree.moveBottomToTop, returning result', function() {
			let moveBottomToTop = sinon.stub(heap.tree, 'moveBottomToTop').returns('A');
			let siftDown = sinon.stub(heap.tree, 'siftDown');

			let result = heap.pop();

			expect(moveBottomToTop).to.be.calledOnce;
			expect(moveBottomToTop).to.be.calledOn(heap.tree);
			expect(siftDown).to.be.calledOnce;
			expect(siftDown).to.be.calledOn(heap.tree);
			expect(siftDown).to.be.calledWith(0, compare);
			expect(siftDown).to.be.calledAfter(moveBottomToTop);
			expect(result).to.equal('A');
		});
	});

	describe('#pushPop', function() {
		it('sifts down from top after tree.replaceTopIfLarger, returning result', function() {
			let replaceTopIfLarger = sinon.stub(heap.tree, 'replaceTopIfLarger').returns('A');
			let siftDown = sinon.stub(heap.tree, 'siftDown');

			let result = heap.pushPop('B');

			expect(replaceTopIfLarger).to.be.calledOnce;
			expect(replaceTopIfLarger).to.be.calledOn(heap.tree);
			expect(replaceTopIfLarger).to.be.calledWith('B', compare);
			expect(siftDown).to.be.calledOnce;
			expect(siftDown).to.be.calledOn(heap.tree);
			expect(siftDown).to.be.calledWith(0, compare);
			expect(siftDown).to.be.calledAfter(replaceTopIfLarger);
			expect(result).to.equal('A');
		});
	});

	describe('#update', function() {
		let update: sinon.SinonStub;

		beforeEach(function() {
			heap.tree.push('A', 'B', 'C');
			update = sinon.stub(heap.tree, 'update');
		});

		it('invokes tree.update at index of provided item', function() {
			heap.update('B');

			expect(update).to.be.calledOnce;
			expect(update).to.be.calledOn(heap.tree);
			expect(update).to.be.calledWith(1, compare);
		});

		it('throws if item is not found in tree', function() {
			expect(() => {
				heap.update('D');
			}).to.throw(Error).which.satisfies((err) => {
				expect(err.message).to.equal('Item D not found in heap.');
				expect(update).to.not.be.called;
				return true;
			});
		});
	});

	describe('#replace', function() {
		let replace: sinon.SinonStub;
		let update: sinon.SinonStub;

		beforeEach(function() {
			heap.tree.push('A', 'B', 'C');
			replace = sinon.stub(heap.tree, 'replace');
			update = sinon.stub(heap.tree, 'update');
		});

		it('replaces item with another and updates its position', function() {
			heap.replace('B', 'D');

			expect(replace).to.be.calledOnce;
			expect(replace).to.be.calledOn(heap.tree);
			expect(replace).to.be.calledWith(1, 'D');
			expect(update).to.be.calledOnce;
			expect(update).to.be.calledOn(heap.tree);
			expect(update).to.be.calledWith(1, compare);
			expect(update).to.be.calledAfter(replace);
		});

		it('throws if item is not found in tree', function() {
			expect(() => {
				heap.replace('D', 'E');
			}).to.throw(Error).which.satisfies((err) => {
				expect(err.message).to.equal('Item D not found in heap.');
				expect(replace).to.not.be.called;
				expect(update).to.not.be.called;
				return true;
			});
		});
	});
});
