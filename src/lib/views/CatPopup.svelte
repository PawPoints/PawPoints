<script lang="ts">
    import type { Cat } from '$lib/types/cat.d.ts'
    import { EyeOutline, HourglassOutline } from "flowbite-svelte-icons"
    export let cat: Cat;

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
</script>

<div class="container">
    <img src={cat.image} alt=""/>
    <div>
        <h1>{cat.name}</h1>
        <div class="cat-stats space-x-1">
            <p>{cat.breed}</p>
            <div class="flex space-x-1">
                <EyeOutline size="sm" />
                <p>{timeSince(cat.lastSeen)}</p>
            </div>
            <div class="flex space-x-1">
                <HourglassOutline size="sm" />
                <p>{timeSince(cat.lastFed)}</p>
            </div>
        </div>
        <!-- <p>Breed: {cat.breed}</p>
        <p>Last fed: {cat.lastSeen.getMonth()}/{cat.lastSeen.getDate()}/{cat.lastSeen.getFullYear()%100}</p> -->
    </div>
</div>
<p>{cat.description}</p>

<style>
    .cat-stats {
        display: flex;
        flex-direction: column;
        font-size: 1em;
    }
    .container {
        display: flex;
        gap: 5px;
    }
    img {
        width: 100px;
        height: 100px;
        border-radius: 20%;
    }
</style>