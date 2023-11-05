<script lang="ts">
	import type { Cat } from '$lib/types/cat.d.ts'
	import { getCats, setCat, pawUser, user, updatePawPoints, catAdded } from '$lib/firebase'
	import { onMount } from 'svelte'
	import { CheckOutline } from 'flowbite-svelte-icons'
	// import type { CatLocation } from '$lib/types/cat_location.d.ts'
	import { ConfettiBurst } from 'svelte-canvas-confetti'
	import { tick } from 'svelte'

	export let map = null

	let cats: Cat[] = []
	let currentlyOnDisplay: Cat[] = []

	onMount(() => {
		getCats().then((data) => {
			cats = data
			currentlyOnDisplay = cats
			currentlyOnDisplay = currentlyOnDisplay.sort((a, b) => {
				return a.lastFed.getTime() - b.lastFed.getTime()
			})
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

	function showFeedModal(cat: Cat) {
		document.getElementById('cat-modal').style.display='block';
	}

	function feed(cat: Cat) {
		setCat(cat, 'lastFed', new Date())
		console.log("FEEDING")
		cats = [...cats]
		currentlyOnDisplay = [...currentlyOnDisplay]
		currentlyOnDisplay = currentlyOnDisplay.sort((a, b) => {
			return a.lastFed.getTime() - b.lastFed.getTime()
		})
		if ($pawUser && $user) {
			$pawUser.pawPoints += 20
			updatePawPoints($pawUser.pawPoints, $user.uid)
			makeConfettiBurst()
		}
	}

	const makeConfettiBurst = async () => {
		confettiBurst = false
		await tick()
		confettiBurst = true
	}

	catAdded.push((cat) => {
		cats = [...cats, cat]
	})

	function navigateToCat(cat: Cat) {
		map.flyTo({
			center: [cat.location.lng, cat.location.lat],
			zoom: 15
		})
	}

	let search = ''

	function handleSearch(e: Event) {
		currentlyOnDisplay = cats.filter((cat) => {
			return cat.name.toLowerCase().includes(search.toLowerCase().trim())
		})
		currentlyOnDisplay = currentlyOnDisplay.sort((a, b) => {
			return a.lastFed.getTime() - b.lastFed.getTime()
		})
		// cats = getCats()	.then((data) => {
		// 	return data.filter((cat) => {
		// 		return cat.name.toLowerCase().includes(search)
		// 	})
		// })
	}

	function computerColor(date: Date) {
		let hours = (Date.now() - date.getTime()) / 1000 / 60 / 60;
		
		return hours > 6 ? (hours > 12 ? "text-red-600" : "text-yellow-500") : "text-green-600";
	}

	let confettiBurst = false
</script>

{#if confettiBurst}
	<ConfettiBurst origin={[window.innerWidth * 0.81, 0]} />
{/if}
<div class="cats flex flex-col space-y-2">
	<div>
		<input
		type="text"
		on:keyup={handleSearch}
		placeholder="Search cats"
		class="rounded p-2 shadow-md bg-[#EDFBFE] border-transparent outline-none"
		bind:value={search}
		/>
	</div>
	{#each currentlyOnDisplay as cat}
		<div class="cat flex flex-row justify-between">
			<div
				class="flex flex-row items-center space-x-2 cursor-pointer"
				on:click={() => navigateToCat(cat)}
			>
				<img src={cat.image} alt="" />
				<p>{cat.name}</p>
			</div>
			<div class="flex items-center space-x-2">
				<p class={"text-xs " + computerColor(cat.lastFed)}>{timeSince(cat.lastFed)}</p>
				{#if $user}
					<button
					on:click={() => showFeedModal(cat)}
					class="plus-button"
					>
						<CheckOutline />
					</button>
				{/if}
			</div>
		</div>
	{/each}
</div>

<style>
	:global(svg) {
		outline: none;
	}
	.cat {
		display: flex;
		align-items: center;
		gap: 5px;
	}

	.cats {
		max-height: 65vh;
		/* overflow: scroll; */
	}

	@media(max-width: 500px) {
		.cats {
			max-height: 33vh;
		}
	}

	.hideScroll::-webkit-scrollbar {
		display: none;
	}
	.hidescroll {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}

	img {
		/* circular image */
		border-radius: 50%;
		width: 30px;
		height: 30px;
	}

	input {
		width: 90%;
	}

	.plus-button {
		background: #83BD85;
		border-radius: 10px;
		box-shadow: #83bd85d0 0 10px 10px -10px;
		box-sizing: border-box;
		color: #FFFFFF;
		cursor: pointer;
		font-family: Inter,Helvetica,"Apple Color Emoji","Segoe UI Emoji",NotoColorEmoji,"Noto Color Emoji","Segoe UI Symbol","Android Emoji",EmojiSymbols,-apple-system,system-ui,"Segoe UI",Roboto,"Helvetica Neue","Noto Sans",sans-serif;
		font-weight: 700;
		opacity: 1;
		outline: 0 solid transparent;
		padding: 3px 15px;
		user-select: none;
		-webkit-user-select: none;
		touch-action: manipulation;
		width: fit-content;
		word-break: break-word;
		border: 0;
	}
</style>
