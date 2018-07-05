import HeapTree from './heap-tree';
import { defaultCompare } from './utils';

export default class Heap<T> {
	compare: Function;
	tree: HeapTree<T>;

	constructor(compare: Function = defaultCompare) {
		this.compare = compare;
		this.tree = new HeapTree<T>();
	}

	push(item: T): void {
		this.tree.push(item);
		this.tree.siftUp(this.tree.length - 1, this.compare);
	}
}