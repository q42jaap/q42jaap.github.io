<script lang="ts">
	import ImgA from '$lib/images/avatar-candidate-A.jpg';
	import ImgB from '$lib/images/avatar-candidate-B.jpg';
	import ImgC from '$lib/images/avatar-candidate-C.jpg';
	import ImgD from '$lib/images/avatar-candidate-D.jpg';
	import ImgE from '$lib/images/avatar-candidate-E.jpg';
	import ImgF from '$lib/images/avatar-candidate-F.jpg';
	import ImgG from '$lib/images/avatar-candidate-G.jpg';
	import ImgH from '$lib/images/avatar-candidate-H.jpg';
	import ImgI from '$lib/images/avatar-candidate-I.jpg';
	import ImgJ from '$lib/images/avatar-candidate-J.jpg';
	import CandidateImg from './CandidateImg.svelte';
	import { writable } from 'svelte/store';
	import { type Candidate, Punten } from './utils';

	const kandidaten: Array<{
		id: string;
		naam: string;
		img: string;
	}> = [
		{ id: 'A', img: ImgA, naam: 'Anna' },
		{ id: 'B', img: ImgB, naam: 'Baps' },
		{ id: 'C', img: ImgC, naam: 'Fons' },
		{ id: 'D', img: ImgD, naam: 'Jeroen' },
		{ id: 'E', img: ImgE, naam: 'Jip' },
		{ id: 'F', img: ImgF, naam: 'Justin' },
		{ id: 'G', img: ImgG, naam: 'Kees' },
		{ id: 'H', img: ImgH, naam: 'Rian' },
		{ id: 'I', img: ImgI, naam: 'Rosario' },
		{ id: 'J', img: ImgJ, naam: 'Tooske' }
	];

	function getCandidate(id: string): Candidate {
		const k = kandidaten.find((kandidaat) => kandidaat.id === id);
		if (!k) throw new Error(`Kandidaat met id ${id} niet gevonden`);
		return k;
	}

	const punten = writable(new Punten(100));

	function clickCandidate(kandidaat: Candidate) {
		punten.update((punten) => {
			if (punten.has(kandidaat.id)) {
				return punten.delete(kandidaat.id);
			} else {
				return punten.set(kandidaat.id, 0);
			}
		});
	}

	function candidateInput(id: string, evt: Event & { currentTarget: HTMLInputElement }) {
		let points = parseInt(evt.currentTarget.value, 10);
		if (isNaN(points)) {
			points = 0;
		}
		if (points < 0) return;
		if (points > $punten.allowedPoints(id)) {
			points = $punten.allowedPoints(id);
			evt.currentTarget.value = points.toString();
		}
		punten.update((p) => p.set(id, points));
	}
</script>

<svelte:head>
	<title>Opdracht 2</title>
</svelte:head>

<section class="text-column">
	<h1>Opdracht 2: Wie is de Mol verdenkspel</h1>
	<p>In de app kan je punten inzetten op de kandidaat die je het meest verdacht vindt.</p>
	<h2>Wie verdenk jij?</h2>
	<div class="candidates-box">
		{#each kandidaten as kandidaat (kandidaat.id)}
			<CandidateImg
				{kandidaat}
				on:click={() => clickCandidate(kandidaat)}
				selected={$punten.has(kandidaat.id)}
			/>
		{/each}
	</div>
	<h2>Punten</h2>
	<p>
		Je hebt in totaal {$punten.limit} punten<br />
		Je hebt nog <b>{$punten.pointsLeft()}</b> punten om in te zetten
	</p>
	<table>
		{#each $punten.keys() as id (id)}
			<tr>
				<td>{getCandidate(id).naam}</td>
				<td>
					<input
						class="point-input"
						type="number"
						max={$punten.allowedPoints(id)}
						min="0"
						on:input={(evt) => candidateInput(id, evt)}
					/>
				</td>
			</tr>
		{/each}
	</table>
	<h2>Insturen</h2>
	<p>
		Als je al je punten hebt ingezet mag je je verdenking insturen.<br />
		<button disabled={!$punten.isValid()} on:click={() => alert('Je punten zijn ingestuurd!')}>
			Insturen
		</button>
	</p>
</section>

<style>
	.candidates-box {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
	}
	.point-input {
		width: 150px;
	}
</style>
