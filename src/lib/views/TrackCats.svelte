<script lang="ts">
	import type { Cat } from '$lib/types/cat.d.ts'
	import { getCats, setCat, pawUser, user, updatePawPoints } from '$lib/firebase'
	import { onMount } from 'svelte'
	import { CheckOutline } from 'flowbite-svelte-icons'
	// import type { CatLocation } from '$lib/types/cat_location.d.ts'
	import { ConfettiBurst } from 'svelte-canvas-confetti';
	import {tick} from 'svelte';
	let cats: Cat[] = []

	onMount(() => {
		getCats().then((data) => {
			cats = data
		})
	})

	function timeSince(date: Date) {
		const now = new Date()
		const secondsPast = (now.getTime() - date.getTime()) / 1000

		// Create an instance of Intl.RelativeTimeFormat
		const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

		if (secondsPast < 60) {
			// less than a minute
			return rtf.format(-Math.floor(secondsPast), 'second')
		}
		const minutesPast = secondsPast / 60
		if (minutesPast < 60) {
			// less than an hour
			return rtf.format(-Math.floor(minutesPast), 'minute')
		}
		const hoursPast = minutesPast / 60
		if (hoursPast < 24) {
			// less than a day
			return rtf.format(-Math.floor(hoursPast), 'hour')
		}
		const daysPast = hoursPast / 24
		if (daysPast < 30) {
			// less than a month
			return rtf.format(-Math.floor(daysPast), 'day')
		}
		const monthsPast = daysPast / 30
		if (monthsPast < 12) {
			// less than a year
			return rtf.format(-Math.floor(monthsPast), 'month')
		}
		const yearsPast = monthsPast / 12
		return rtf.format(-Math.floor(yearsPast), 'year')
	}

	function fed(cat: Cat) {
		setCat(cat, 'lastFed', new Date());
		cats = [...cats];
		if ($pawUser && $user) {
			$pawUser.pawPoints += 20;
			updatePawPoints($pawUser.pawPoints, $user.uid);
			makeConfettiBurst();
		}
	}

	const makeConfettiBurst = async () => {
		confettiBurst = false;
		await tick();
		confettiBurst = true;
	}

	let confettiBurst = false;
</script>

{#if confettiBurst}
	<ConfettiBurst 
		origin={[window.innerWidth * 0.81, 0]}
	/>
{/if}
<div class="cats flex flex-col space-y-2">
	{#each cats as cat}
		<div class="cat flex flex-row justify-between">
			<div class="flex flex-row items-center space-x-2">
				<img src={cat.image} alt="" />
				<p>{cat.name}</p>
			</div>
			<div class="flex space-x-2">
				<p class="text-xs text-yellow-600">{timeSince(cat.lastFed)}</p>
				<button on:click={fed(cat)} class="bg-green-100 hover:bg-green-200 text-green-800 font-semiboldborder border-green-400 rounded">
					<CheckOutline/>
				</button>
			</div>
		</div>
	{/each}
</div>

<style>
	.cat {
		display: flex;
		align-items: center;
		gap: 5px;
	}

	img {
		/* circular image */
		border-radius: 50%;
		width: 30px;
		height: 30px;
	}
</style>
