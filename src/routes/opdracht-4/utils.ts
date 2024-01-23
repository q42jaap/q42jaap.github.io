import type { Punten } from '../opdracht-2/utils';

export type Candidate = {
	id: string;
	img: string;
	naam: string;
};

export type CalcResult = {
	error?: string;
	score: number;
	correct: boolean;
};

export class Calc {
	afvallerId: string | undefined;

	constructor(public readonly punten: Punten) {}

	keys(): string[] {
		return this.punten.keys();
	}

	toggleAfvaller(id: string): Calc {
		this.afvallerId = this.afvallerId === id ? undefined : id;
		return this;
	}

	isAfvaller(id: string): boolean {
		return this.afvallerId === id;
	}

	transform(programma: string): string {
		return programma
			.toLowerCase()
			.replace(/\bis[ ]+niet\b/g, '!=')
			.replace(/\baf\b/g, 'afvaller')
			.replace(/als[ ]+/g, 'if (')
			.replace(/,[ ]*dan[ ]+(.*)/g, ') {$1}')
			.replace(/\bwor[dt]{1,2}\b/g, '=')
			.replace(/punten[ ]+van[ ]+([\w]+)/g, 'punten($1)')
			.toString();
	}

	calculate(programma: string): CalcResult {
		const that = {
			scope: {
				anna: 'A',
				baps: 'B',
				fons: 'C',
				jeroen: 'D',
				jip: 'E',
				justin: 'F',
				kees: 'G',
				rian: 'H',
				rosario: 'I',
				tooske: 'J',
				punten: (id: string) => this.punten.get(id),
				afvaller: this.afvallerId
			}
		};

		try {
			const result = Function(`score=-1
with(this.scope) {
	console.log(anna);
  ${programma}
}; return score`).bind(that)();
			console.log('result', result);
			return {
				score: result,
				correct: result === this.realCalculate()
			};
		} catch (e) {
			return {
				error: friendlyError((e as Error).message),
				score: -2,
				correct: false
			};
		}
	}

	realCalculate(): number {
		let score = 0;
		for (const id of this.punten.keys()) {
			if (id !== this.afvallerId) {
				score += this.punten.get(id) * 2;
			}
		}
		return score;
	}

	hasAfvaller(): boolean {
		return this.afvallerId !== undefined;
	}
}

function friendlyError(message: string): string {
	let m: RegExpMatchArray | null;
	m = message.match(/(.*) is not defined/);
	if (m) return `De naam "${m[1]}" bestaat niet in dit programma.`;
	m = message.match(/Unexpected identifier '(.*)'/);
	if (m) return `Je mist een signaalwoord (of komma) in de buurt van "${m[1]}".`;
	return message;
}
