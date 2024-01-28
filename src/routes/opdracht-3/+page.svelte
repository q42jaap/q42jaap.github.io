<script lang="ts">
	import ImgA from '$lib/images/avatar-candidate-A.jpg';
	import ImgC from '$lib/images/avatar-candidate-C.jpg';
	import ImgG from '$lib/images/avatar-candidate-G.jpg';
	import ImgE from '$lib/images/avatar-candidate-E.jpg';
	import CandidateImg from '../opdracht-2/CandidateImg.svelte';
	import { writable } from 'svelte/store';
	import { Calc, type Candidate } from './utils';
	import { Punten } from '../opdracht-2/utils';

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
	}

	const punten = new Punten(100);
	punten.set('A', 25);
	punten.set('E', 25);
	punten.set('G', 50);

	const calc = writable(new Calc(punten));
</script>

<svelte:head>
	<title>Opdracht 3</title>
</svelte:head>

<section class="text-column">
	<h1>Opdracht 3: Score berekenen</h1>
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
				<button on:click={() => (stap = 0)}>Opnieuw</button>
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
				<button on:click={() => (stap = 0)}>Opnieuw</button>
			{/if}
		</div>
	{/if}
</section>

<style>
	.candidates-box {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
	}
</style>
