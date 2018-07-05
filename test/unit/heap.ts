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
});
