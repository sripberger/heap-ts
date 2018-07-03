import * as _ from 'lodash';

export function getParentIndex(index: number): number | null {
	if (index === 0) return null;
	return Math.floor((index - 1) / 2);
}

export function getChildIndexes(index: number): number[] {
	let left = (2 * index) + 1;
	return [left, left + 1];
}

export function getSmallerChildIndex(
	items: any[],
	index: number,
	compare: Function
): number | null {
	let childIndexes: number[] = exports.getChildIndexes(index);
	let children: any[] = _(childIndexes).map((i) => items[i]).filter().value();
	if (children.length === 0) return null;
	if (children.length === 1) return childIndexes[0];
	return childIndexes[(compare(...children) <= 0) ? 0 : 1];
}

export function defaultCompare(a: any, b: any): number {
	if (a < b) return -1;
	if (a == b) return 0;
	return 1;
}
