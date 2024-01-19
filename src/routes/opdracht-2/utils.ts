export type Candidate = {
	id: string;
	img: string;
	naam: string;
};

export class Punten {
	private readonly points = new Map<string, number>();

	constructor(public readonly limit: number) {}

	has(id: string): boolean {
		return this.points.has(id);
	}

	get(id: string): number {
		return this.points.get(id) ?? 0;
	}

	set(id: string, points: number): Punten {
		this.points.set(id, points);
		return this;
	}

	delete(id: string): Punten {
		this.points.delete(id);
		return this;
	}

	keys(): string[] {
		return Array.from(this.points.keys()).sort();
	}

	pointsLeft(): number {
		const pointsGiven = Array.from(this.points.values()).reduce((a, b) => a + b, 0);
		return Math.max(0, this.limit - pointsGiven);
	}

	allowedPoints(id: string): number {
		return this.pointsLeft() + this.get(id);
	}

	isValid(): boolean {
		return this.pointsLeft() === 0;
	}
}
