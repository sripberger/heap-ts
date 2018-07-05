import * as _ from 'lodash';
import { getParentIndex, getChildIndexes } from './utils';

export default class HeapTree<T> extends Array<T> {
	getSmallerChildIndex(index: number, compare: Function): number | null {
		let childIndexes = getChildIndexes(index);
		let children = _(childIndexes).map((i) => this[i]).filter().value();
		if (children.length === 0) return null;
		if (children.length === 1) return childIndexes[0];
		return childIndexes[(compare(...children) <= 0) ? 0 : 1];
	}

	siftUpOnce(index: number, compare: Function): number | null {
		let parentIndex = getParentIndex(index);
		if (parentIndex !== null) {
			let item = this[index];
			let parent = this[parentIndex];
			if (compare(item, parent) < 0) {
				this[index] = parent;
				this[parentIndex] = item;
				return parentIndex;
			}
		}
		return null;
	}

	siftDownOnce(index: number, compare: Function): number | null {
		let childIndex = this.getSmallerChildIndex(index, compare);
		if (childIndex !== null) {
			let item = this[index];
			let child = this[childIndex];
			if (compare(item, child) > 0) {
				this[index] = child;
				this[childIndex] = item;
				return childIndex;
			}
		}
		return null;
	}

	siftUp(start: number, compare: Function): void {
		let index: number | null = start;
		while (index !== null) {
			index = this.siftUpOnce(index, compare);
		}
	}

	siftDown(start: number, compare: Function): void {
		let index: number | null = start;
		while (index !== null) {
			index = this.siftDownOnce(index, compare);
		}
	}

	prePop(): T | null {
		if (!this.length) return null;
		let [ top ] = this;
		let bottom = this.pop();
		if (this.length) this[0] = bottom as T;
		return top;
	}

	replaceTop(item: T): T {
		if (!this.length) return item;
		let [ top ] = this;
		this[0] = item;
		return top;
	}
}
