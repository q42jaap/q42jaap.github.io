export function createArray<T>(size: number, fill: () => T): Array<T> {
	return new Array(size).fill(0).map(fill);
}

export function createGrid(size: number) {
	return createArray(size, () => createArray(size, () => 0));
}

export class GridData {
	private readonly digits: Array<Array<number>>;

	constructor(public readonly size: number) {
		this.digits = createGrid(size);
	}

	toggle({ x, y }: { x: number; y: number }): GridData {
		this.digits[y][x] = this.digits[y][x] === 0 ? 1 : 0;
		return this;
	}

	get(x: number, y: number) {
		return this.digits[y][x];
	}

	toString(): string {
		return this.digits.map((row) => row.join('')).join('');
	}

	static fromString(str: string): GridData {
		const size = Math.sqrt(str.length);
		return GridData.parse(str, size);
	}

	static parse(str: string, size: number): GridData {
		const grid = new GridData(size);
		str = str.substring(0, size * size);
		for (let i = 0; i < str.length; i++) {
			if (str[i] === '1') {
				grid.toggle({ x: i % size, y: Math.floor(i / size) });
			}
		}
		return grid;
	}
}
