import { expect } from 'chai';
import Heap from '../../lib';

// Interface used for heap items in some tests below.
interface TestItem {
	name: string;
	priority: number;
}

describe('Heap', function() {
	it('supports basic heap operations', function() {
		let heap = new Heap<string>();

		heap.push('E');
		heap.push('B');
		heap.push('A');
		heap.push('C');

		// Check proeprties
		expect(heap.length).to.equal(4);
		expect(heap.isEmpty).to.be.false;

		// Items should come off in ascending order...
		expect(heap.pop()).to.equal('A');
		expect(heap.pop()).to.equal('B');

		heap.push('D');

		// regardless of when they were added...
		expect(heap.pop()).to.equal('C');
		expect(heap.pop()).to.equal('D');
		expect(heap.pop()).to.equal('E');

		// Check properties again, now that heap is empty.
		expect(heap.length).to.equal(0);
		expect(heap.isEmpty).to.be.true;

		// Popping from an empty heap returns null.
		expect(heap.pop()).to.be.null;
	});

	it('supports combined push then pop', function() {
		let heap = new Heap<string>();

		heap.push('A');
		heap.push('C');

		// #pushPop should behave like a push followed by a pop.
		// As a single operation it avoids redundant sifting.
		expect(heap.pushPop('B')).to.equal('A');
		expect(heap.pushPop('A')).to.equal('A');
		expect(heap.pushPop('D')).to.equal('B');
		expect(heap.pop()).to.equal('C');
		expect(heap.pop()).to.equal('D');
	});

	it('supports custom comparison function', function() {
		let foo: TestItem = { name: 'foo', priority: 4 };
		let bar: TestItem = { name: 'bar', priority: 3 };
		let baz: TestItem = { name: 'baz', priority: 2 };
		let qux: TestItem = { name: 'qux', priority: 1 };
		let quux: TestItem = { name: 'quux', priority: 0 };
		let heap = new Heap<TestItem>((a, b) => b.priority - a.priority);

		heap.push(bar);
		heap.push(baz);
		heap.push(foo);
		heap.push(quux);

		// Items should come off in order based on compare function...
		expect(heap.pop()).to.equal(foo);
		expect(heap.pop()).to.equal(bar);

		heap.push(qux);

		// regardless of when they were added...
		expect(heap.pop()).to.equal(baz);
		expect(heap.pop()).to.equal(qux);
		expect(heap.pop()).to.equal(quux);
	});

	it('supports updating positions of individual items', function() {
		let foo: TestItem = { name: 'foo', priority: 4 };
		let bar: TestItem = { name: 'bar', priority: 3 };
		let baz: TestItem = { name: 'baz', priority: 2 };
		let qux: TestItem = { name: 'qux', priority: 1 };
		let heap = new Heap<TestItem>((a, b) => b.priority - a.priority);

		heap.push(bar);
		heap.push(baz);
		heap.push(foo);
		heap.push(qux);

		// Drop the priority of an item to make it come out last,
		// even though it wouldn't have originally.
		bar.priority = 0;
		heap.update(bar);

		expect(heap.pop()).to.equal(foo);
		expect(heap.pop()).to.equal(baz);
		expect(heap.pop()).to.equal(qux);
		expect(heap.pop()).to.equal(bar);
	});

	it('supports replacement of inidividual items', function() {
		let foo: TestItem = { name: 'foo', priority: 4 };
		let bar: TestItem = { name: 'bar', priority: 3 };
		let baz: TestItem = { name: 'baz', priority: 2 };
		let qux: TestItem = { name: 'qux', priority: 1 };
		let heap = new Heap<TestItem>((a, b) => b.priority - a.priority);

		heap.push(bar);
		heap.push(baz);
		heap.push(foo);

		// Replace an item that wouldn't go last with something that will,
		// to ensure heap invariant is preserved.
		heap.replace(bar, qux);

		expect(heap.pop()).to.equal(foo);
		expect(heap.pop()).to.equal(baz);
		expect(heap.pop()).to.equal(qux);
	});
});
