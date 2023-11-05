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
	let currentlyDisplaying

	onMount(() => {
		getCats().then((data) => {
			cats = data
			currentlyOnDisplay = cats
			currentlyOnDisplay = currentlyOnDisplay.sort((a, b) => {
				return b.lastFed.getTime() - a.lastFed.getTime()
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
		console.log('running showfeedmodal')
		document.getElementById('cat-modal').outerHTML = `
		<div class="modal s-y_bCXRrkrYfP" id="cat-modal" style="display: block;">
			<div class="modal-content s-y_bCXRrkrYfP">
				<div class="modal-container s-y_bCXRrkrYfP">
					<span onclick="document.getElementById('cat-modal').style.display='none'"
						  style="border:none;display:inline-block;padding:8px 16px;vertical-align:middle;overflow:hidden;text-decoration:none;color:inherit;background-color:inherit;text-align:center;cursor:pointer;white-space:nowrap; position:absolute;right:0;top:0;"
						  class="s-y_bCXRrkrYfP"
						  data-svelte-h="svelte-170515b">
						×
					</span>
					<br>
					<h3>Update Cat Entry</h3>
				</div>
			</div>
		</div>`;
	}

	function feed(cat: Cat) {
		setCat(cat, 'lastFed', new Date())
		cats = [...cats]
		currentlyOnDisplay = [...currentlyOnDisplay]
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
			return b.lastFed.getTime() - a.lastFed.getTime()
		})
		// cats = getCats().then((data) => {
		// 	return data.filter((cat) => {
		// 		return cat.name.toLowerCase().includes(search)
		// 	})
		// })
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
		class="w-fill rounded p-2 shadow-md bg-gray-100 border-transparent outline-none"
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
			<div class="flex space-x-2">
				<p class="text-xs text-yellow-600">{timeSince(cat.lastFed)}</p>
				<button
					on:click={showFeedModal(cat)}
					class="bg-green-100 hover:bg-green-200 text-green-800 font-semiboldborder border-green-400 rounded"
				>
					<CheckOutline />
				</button>
			</div>
		</div>
	{/each}
</div>

<style>
	.hideScroll::-webkit-scrollbar {
		display: none;
	}
	.hidescroll {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}

	.cat {
		display: flex;
		align-items: center;
		gap: 5px;
	}

	.cats {
		max-height: 65vh;
		overflow: scroll;
	}

	@media(max-width: 500px) {
		.cats {
			max-height: 33vh;
		}
	}

	img {
		/* circular image */
		border-radius: 50%;
		width: 30px;
		height: 30px;
	}
</style>
