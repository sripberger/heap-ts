import * as _ from 'lodash';
import * as utils from './utils';

export default class BTree<T> extends Array<T> {
	getSmallerChildIndex(index: number, compare: Function): number | null {
		let childIndexes = utils.getChildIndexes(index);
		let children = _(childIndexes).map((i) => this[i]).filter().value();
		if (children.length === 0) return null;
		if (children.length === 1) return childIndexes[0];
		return childIndexes[(compare(...children) <= 0) ? 0 : 1];
	}
}
