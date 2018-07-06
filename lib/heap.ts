import HeapTree from './heap-tree';
import { defaultCompare } from './utils';

export default class Heap<T> {
	compare: CompareFunction<T>;
	tree: HeapTree<T>;

	constructor(compare: CompareFunction<T> = defaultCompare) {
		this.compare = compare;
		this.tree = new HeapTree<T>();
	}

	push(item: T): void {
		this.tree.push(item);
		this.tree.siftUp(this.tree.length - 1, this.compare);
	}

	pop(): T | null {
		let item = this.tree.moveBottomToTop();
		this.tree.siftDown(0, this.compare);
		return item;
	}

	pushPop(item: T): T {
		let result = this.tree.replaceTopIfLarger(item, this.compare);
		this.tree.siftDown(0, this.compare);
		return result;
	}

	update(item: T): void {
		this.tree.update( this._getItemIndex(item), this.compare);

	}
	replace(item: T, newItem: T): void {
		let itemIndex = this._getItemIndex(item);
		this.tree.replace(itemIndex, newItem);
		this.tree.update(itemIndex, this.compare);
	}

	private _getItemIndex(item: T) {
		let itemIndex = this.tree.indexOf(item);
		if (itemIndex !== -1) return itemIndex;
		throw new Error(`Item ${item} not found in heap.`);
	}
}
