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

	pop(): T | null {
		let item = this.tree.prePop();
		this.tree.siftDown(0, this.compare);
		return item;
	}

	pushPop(item: T): T {
		let result = this.tree.replaceTop(item, this.compare);
		this.tree.siftDown(0, this.compare);
		return result;
	}

	update(item: T): void {
		this.tree.update(this.tree.indexOf(item), this.compare);
	}
}
