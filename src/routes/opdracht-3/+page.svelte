<script lang="ts">
	import ImgA from '$lib/images/avatar-candidate-A.jpg';
	import ImgC from '$lib/images/avatar-candidate-C.jpg';
	import ImgG from '$lib/images/avatar-candidate-G.jpg';
	import ImgE from '$lib/images/avatar-candidate-E.jpg';
	import CandidateImg from '../opdracht-2/CandidateImg.svelte';
	import { writable } from 'svelte/store';
	import { Calc, type CalcResult, type Candidate } from './utils';
	import { Punten } from '../opdracht-2/utils';
	import eye from '$lib/images/eye-svgrepo-com.svg';

	let stap = 0;
	let scoreGok: number | undefined;
	let scoreGetoond: number | undefined;

	function showScore() {
		scoreGetoond = $calc.realCalculate();
	}

	const kandidaten: Array<{
		id: string;
		naam: string;
		img: string;
	}> = [
		{ id: 'A', img: ImgA, naam: 'Anna' },
		{ id: 'C', img: ImgC, naam: 'Fons' },
		{ id: 'E', img: ImgE, naam: 'Jip' },
		{ id: 'G', img: ImgG, naam: 'Kees' }
	];

	function getCandidate(id: string): Candidate {
		const k = kandidaten.find((kandidaat) => kandidaat.id === id);
		if (!k) throw new Error(`Kandidaat met id ${id} niet gevonden`);
		return k;
	}

	function kandidaatClick(id: string) {
		calc.update((c) => c.toggleAfvaller(id));
		stap = Math.max(stap, 1);
		scoreGok = undefined;
		scoreGetoond = undefined;
		calcResult = undefined;
	}

	const punten = new Punten(100);
	punten.set('A', 25);
	punten.set('E', 25);
	punten.set('G', 50);

	const calc = writable(new Calc(punten));

	let calcResult: CalcResult | undefined;

	const startProgramma = `score = 0

als anna is niet af, dan score += punten van anna * 2
`;

	const oplossingProgramma = `score = 0

als anna is niet af, dan score += punten van anna * 2
als fons is niet af, dan score += punten van fons * 2
als jip is niet af, dan score += punten van jip * 2
als kees is niet af, dan score += punten van kees * 2
`;
	const echtProgramma = `score = 0
if (anna != afvaller) {
  score = score + punten(anna) * 2
}
if (fons != afvaller) {
  score = score + punten(fons) * 2
}
if (kees != afvaller) {
  score = score + punten(jip) * 2
}
if (rian != afvaller) {
  score = score + punten(kees) * 2
}`;
	let programma: string = startProgramma;

	function calculate() {
		let transformedProgramma: string;
		try {
			transformedProgramma = $calc.transform(programma);
		} catch (e) {
			alert('Er ging iets mis met het transformeren van het programma.');
			return;
		}
		console.log({ transformedProgramma });

		calcResult = $calc.calculate(transformedProgramma);
	}

	let eyePressed = false;

	function hiddenText(text: string): string {
		return text.replace(/[\S]/g, '*');
	}
</script>

<svelte:head>
	<title>Opdracht 3</title>
</svelte:head>

<section class="text-column">
	<h1>Opdracht 3: Programmeren</h1>
	<p>
		Als de afvaller bekend is gaat de computer voor iedereen die de app gebruikt uitrekenen wat de
		nieuwe score is.
	</p>
	<h2>Jouw verdenking</h2>
	<table>
		{#each punten.keys() as id (id)}
			<tr>
				<td>{getCandidate(id).naam}</td>
				<td>
					{punten.get(id)}
				</td>
			</tr>
		{/each}
	</table>

	<h2>Wie valt er af?</h2>
	<p>Kies wie er afvalt</p>
	<div class="candidates-box">
		{#each kandidaten as kandidaat (kandidaat.id)}
			<CandidateImg
				{kandidaat}
				on:click={() => kandidaatClick(kandidaat.id)}
				selected={$calc.isAfvaller(kandidaat.id)}
				red
			/>
		{/each}
	</div>

	{#if stap === 1}
		<h2>Wat wordt de score?</h2>
		<p>
			De punten voor iemand die niet afvalt worden verdubbeld.<br />De punten voor iemand die wel
			afvalt raak je kwijt.
		</p>
		<p>
			Bedenk zelf wat de score zou moeten zijn:
			<input type="number" bind:value={scoreGok} />
		</p>

		<div>
			{#if scoreGetoond === undefined}
				<div>
					<button disabled={scoreGok === undefined} on:click={showScore}>Check score</button>
				</div>
			{:else if scoreGetoond === scoreGok}
				<p>Goed zo!</p>
				<button on:click={() => (stap = 2)}>Volgende</button>
			{:else}
				<p>Helaas, dat is niet goed.</p>
				{#if $calc.isAfvaller('C')}
					<p>Fons is afgevallen, maar er waren geen punten ingezet.</p>
				{/if}
				{#if $calc.isAfvaller('A')}
					<p>Anna is afgevallen, de ingezette punten voor Jip en Kees worden verdubbeld.</p>
				{/if}
				{#if $calc.isAfvaller('E')}
					<p>Jip is afgevallen, de ingezette punten voor Anna en Kees worden verdubbeld.</p>
				{/if}
				{#if $calc.isAfvaller('G')}
					<p>Kees is afgevallen, de ingezette punten voor Anna en Jip worden verdubbeld.</p>
				{/if}
				<p>De goede score moest zijn: {scoreGetoond}</p>
				<button on:click={() => (stap = 2)}>Volgende</button>
			{/if}
		</div>
	{/if}
	{#if stap === 2}
		<h2>Programmeren</h2>
		We gaan nu zelf de computer programmeren, zodat deze de score berekend. De regel voor Anna is al
		ingevuld. Jij moet de regels voor de andere kandidaten typen.
		<textarea
			class="programma-textarea"
			bind:value={programma}
			on:input={() => (calcResult = undefined)}
		/>
		{#if calcResult?.error}
			<p class="error-message">{calcResult.error}</p>
		{/if}
		<p>
			Als je klaar bent met typen klik dan op de knop.<br />
			Als je iets verkeerd hebt getypt verschijnt er een foutmelding.<br />
			<button on:click={calculate}>Berekenen</button>
		</p>

		{#if calcResult?.score !== undefined}
			<h2>De score is: {calcResult?.score}</h2>
		{/if}

		{#if calcResult?.correct}
			<h3>Goed gedaan!</h3>
			Verander de afvaller en kijk of je programma nog steeds goed werkt.
		{/if}
		{#if calcResult?.correct === false}
			<h3>Dat klopt niet</h3>
			Het programma doet het wel, maar het antwoord is niet goed. Je kunt met de muis over het oogje
			gaan om het goede programma te zien.
		{/if}

		<div>
			<p>&nbsp;</p>
			<p>&nbsp;</p>
			<p>&nbsp;</p>
			<button
				on:mouseover={() => (eyePressed = true)}
				on:focus={() => (eyePressed = true)}
				on:mouseleave={() => (eyePressed = false)}
			>
				<img class="eye-icon" src={eye} alt="oogje" />
			</button>
		</div>
		<textarea
			class="programma-textarea"
			value={eyePressed ? oplossingProgramma : hiddenText(oplossingProgramma)}
			readonly
		/>
	{/if}
</section>

<style>
	.candidates-box {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
	}
	.programma-textarea {
		width: 650px;
		height: 250px;
	}
	.error-message {
		color: red;
	}
	.eye-icon {
		width: 30px;
		height: 30px;
	}
</style>
