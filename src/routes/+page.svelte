<script lang="ts">
	import '../app.postcss'

	import { onMount } from 'svelte'
	import { login } from '$lib/firebase'
	import { getCats, catAdded } from '$lib/firebase'
	import { QuestionCircleSolid } from 'flowbite-svelte-icons'
	import type { Cat } from '$lib/types/cat.d.ts'
	import mapboxgl from 'mapbox-gl'
	import FoundCat from '$lib/views/FoundCat.svelte'
	import TrackCats from '$lib/views/TrackCats.svelte'
	import NavBar from '$lib/views/NavBar.svelte'
	import CatPopup from '$lib/views/CatPopup.svelte'
	import CatModal from '$lib/views/CatModal.svelte'
	import type { User } from 'firebase/auth'

	let displayTrackedCats = true
	let showFeedModalBool = false

	let foundCat: FoundCat
	let catTracker: TrackCats

	let clickMarker
	let map

	let query = '(min-width: 500px)'
	let mql
	let mqlListener
	let wasMounted
	let matches = true

	$: {
		if (wasMounted) {
			removeActiveListener()
			addNewListener()
		}
	}

	function addNewListener() {
		mql = window.matchMedia(query)
		mqlListener = (result) => (matches = result.matches)
		mql.addEventListener('change', mqlListener)
		matches = mql.matches
	}

	function removeActiveListener() {
		if (mql && mqlListener) {
			mql.removeEventListener('change', mqlListener)
		}
	}

	onMount(() => {
		wasMounted = true

		mapboxgl.accessToken =
			'pk.eyJ1IjoidHdpbmtsZWJ1bnoxMDciLCJhIjoiY2xoMmFoMWl2MWF5YjNzbXB2amc3NmdiaiJ9.TtL3czNMJqBCphmq2_arqg'

		map = new mapboxgl.Map({
			container: 'mapcontainer',
			style: 'mapbox://styles/mapbox/streets-v12',
			center: [-95.1266301248878, 44.05209890150269],
			zoom: 4
		})

		// map.addControl(
		// 	new mapboxgl.GeolocateControl({
		// 			positionOptions: {
		// 				enableHighAccuracy: true
		// 			},
		// 			trackUserLocation: true,
		// 			showUserHeading: true
		// 	})
		// );

		clickMarker = new mapboxgl.Marker({
			color: '#FFFFFF'
		})

		map.on('click', (e) => {
			if (foundCat) {
				foundCat.updateLocation({
					lng: e.lngLat.lng,
					lat: e.lngLat.lat
				})
				clickMarker.setLngLat(e.lngLat).addTo(map)
			}
		})

		let userLocation: mapboxgl.LngLatLike

		navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
			enableHighAccuracy: true
		})

		function successLocation(position: GeolocationPosition) {
			let lat = position.coords.latitude
			let long = position.coords.longitude

			userLocation = [long, lat]
			map.flyTo({ center: userLocation, zoom: 13 })
		}

		function errorLocation(e: GeolocationPositionError) {
			console.log(e)
		}

		let cats: Cat[] = []

		getCats().then((data) => {
			for (let i = 0; i < data.length; i++) {
				addCatMarker(data[i])
			}
		})

		return () => {
			removeActiveListener()
		}
	})

	function addCatMarker(cat: Cat) {
		let el = document.createElement('div')
		el.className = 'marker' // Assign a class for styling
		el.style.backgroundImage = `url(${cat.image})`
		const popup = new mapboxgl.Popup({ offset: 25 }).setText(cat.name)
		let marker = new mapboxgl.Marker(el)
			.setLngLat([cat.location.lng, cat.location.lat])
			.addTo(map)
		marker.setPopup(popup)
		const container = document.createElement('div')
		let cp = new CatPopup({
			target: container,
			props: {
				cat: cat
			}
		})
		popup.setDOMContent(container)
	}

	catAdded.push((cat) => {
		addCatMarker(cat)
	})

	function updateDispalyTrackedCats(display: boolean) {
		if (display && clickMarker) {
			clickMarker.remove()
		}
		displayTrackedCats = display
	}
</script>

<svelte:head>
	<script src="https://api.mapbox.com/mapbox-gl-js/v2.1.1/mapbox-gl.js"></script>
	<link href="https://api.mapbox.com/mapbox-gl-js/v2.1.1/mapbox-gl.css" rel="stylesheet" />
	<script
		src="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-directions/v4.1.0/mapbox-gl-directions.js"
	></script>
	<link
		rel="stylesheet"
		href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-directions/v4.1.0/mapbox-gl-directions.css"
		type="text/css"
	/>
</svelte:head>

<div>
	<div id="mapcontainer" />
	<div class="sidebar" style="gap: 10px;">
		<center>
			<div
				class="mapbox-directions-profile mapbox-directions-component-keyline mapbox-directions-clearfix"
			>
				<input
					id="mapbox-directions-profile-driving-traffic"
					type="radio"
					name="profile"
					value="mapbox/driving-traffic"
					checked={true}
				/>
				<label
					for="mapbox-directions-profile-driving-traffic"
					style={matches ? `width: 10.65vw;` : `width: 42vw`}
					on:click={() => updateDispalyTrackedCats(true)}>Tracked Cats</label
				>
				<input
					id="mapbox-directions-profile-cycling"
					type="radio"
					name="profile"
					value="mapbox/cycling"
				/>
				<label
					for="mapbox-directions-profile-cycling"
					style={matches ? `width: 10.65vw;` : `width: 42vw`}
					on:click={() => updateDispalyTrackedCats(false)}>Found a Cat?</label
				>
			</div>
		</center>
		<br />
		<div class="sidesection bg-opacity-60 bg-white">
			{#if displayTrackedCats}
				<TrackCats bind:this={catTracker} bind:map />
			{:else}
				<FoundCat bind:this={foundCat} />
			{/if}
		</div>
	</div>

	<div class="questionmark" onclick="document.getElementById('modal').style.display='block';">
		<center>
			<QuestionCircleSolid class="w-13 h-13" />
		</center>
	</div>

	<div class="modal" id="modal">
		<div class="modal-content">
			<div class="modal-container">
				<span
					onclick="document.getElementById('modal').style.display='none'"
					style="border:none;display:inline-block;padding:8px 16px;vertical-align:middle;overflow:hidden;text-decoration:none;color:inherit;background-color:inherit;text-align:center;cursor:pointer;white-space:nowrap; position:absolute;right:0;top:0;"
					>&times;</span
				>
				<br />
				<h3><center>How to Use</center></h3>
				<br />
				<p>
					Welcome to our web page! This platform is designed to help you locate stray cats
					in your area. Here's how it works:
				</p>
				<br />
				<p>
					1. Feeding and Earning PawPoints: Whenever you feed a stray cat and provide
					photo evidence, you'll earn PawPoints.
				</p>
				<br />
				<p>
					2. Sidebar Sections: On the left side of the page, you'll find two main
					sections:
				</p>
				<br />
				<p>
					a. Tracked Cats: In this section, you can view the locations of all the cats
					that have been tracked.
				</p>
				<br />
				<p>
					b. Found a Cat?: If you come across a new stray cat, you can use this section to
					report it. Simply upload a picture of the cat, provide a name, and describe its
					appearance or any unique habits you've observed. After that, just click on the
					map to pinpoint the cat's location, and click the "Add Cat" button to submit the
					cat's information.
				</p>
				<br />
				<p>
					We hope you find this page helpful in your mission to care for stray cats and
					make a positive impact!
				</p>
			</div>
		</div>
	</div>

	<div class="modal s-y_bCXRrkrYfP" id="cat-modal" style="display: none;">
		<div class="modal-content s-y_bCXRrkrYfP" style="width: min(85vw, 600px);">
			<div class="modal-container s-y_bCXRrkrYfP">
				<span onclick="document.getElementById('cat-modal').style.display='none'" style="border:none;display:inline-block;padding:8px 16px;vertical-align:middle;overflow:hidden;text-decoration:none;color:inherit;background-color:inherit;text-align:center;cursor:pointer;white-space:nowrap; position:absolute;right:0;top:0;" class="s-y_bCXRrkrYfP" data-svelte-h="svelte-1f0ggbm">×</span> <br class="s-y_bCXRrkrYfP"> 
				<h2 class="s-y_bCXRrkrYfP">
				   <center class="s-y_bCXRrkrYfP"><b class="s-y_bCXRrkrYfP" data-svelte-h="svelte-l4ws2n">Update Food Bowl</b></center>
				</h2>
				<br class="s-y_bCXRrkrYfP"> 
				<center class="s-y_bCXRrkrYfP">
				   <input id="cat-uuid" type="hidden" />
				   <p class="s-y_bCXRrkrYfP"><i class="s-y_bCXRrkrYfP">Post a photo of your filled<br class="s-y_bCXRrkrYfP">foodbowl for confirmation:</i><br class="s-y_bCXRrkrYfP"><br class="s-y_bCXRrkrYfP"></p>
				   <div class="cat-image relative s-y_bCXRrkrYfP">
						<input type="file" id="myFile" name="filename" class="s-y_bCXRrkrYfP" style="padding-left: 5.5vw;">
					</div>
				   <br class="s-y_bCXRrkrYfP"><br class="s-y_bCXRrkrYfP"> 
				   <p class="s-y_bCXRrkrYfP"><i class="s-y_bCXRrkrYfP" data-svelte-h="svelte-ko83zt">Did the cat eat the food from last time?</i><br class="s-y_bCXRrkrYfP"><br class="s-y_bCXRrkrYfP"></p>
				   <input type="checkbox" id="yes" name="yes" class="s-y_bCXRrkrYfP" value="Yes">
				   <label for="yes" class="s-y_bCXRrkrYfP" data-svelte-h="svelte-1vgb7r8">Yes &nbsp;</label>
				   <input type="checkbox" id="no_checkbox" name="no" class="s-y_bCXRrkrYfP" value="No">
				   <label for="no" class="s-y_bCXRrkrYfP" data-svelte-h="svelte-13wa16g">No</label>
				   <br><br>
				   <input type="submit"
				   		  value="Submit"
					      on:click={() => catTracker.feed()}
						  style="background-color: rgb(52, 71, 86); border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px;">
				</center>
				<br class="s-y_bCXRrkrYfP">
			 </div>
		</div>
	 </div>
</div>

<style>
	:global(.marker) {
		width: 50px;
		aspect-ratio: 1;
		border-radius: 50%;
		background-size: 100%;
		background-repeat: no-repeat;
	}

	.sidebar {
		margin: 1vw;
		margin-top: 93px;
		position: relative;
		width: 24vw;
	}

	@media (max-width: 500px) {
		.sidebar {
			width: 98vw;
			top: 40vh;
			max-height: 100px !important;
		}
	}

	.questionmark {
		float: right;
		background-color: rgba(255, 255, 255, 0.5);
		width: 5vw;
		height: 5vw;
		bottom: 3.5vh;
		right: 1vh;
		position: absolute;
		border-radius: 50%;
		transition-duration: 0.4s;
	}

	.questionmark:hover {
		background-color: rgba(255, 255, 255, 1);
		cursor: pointer;
	}

	#mapcontainer {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 100%;
	}

	.menu {
		position: relative;
		width: 20%;
		padding: 1% 3% 1% 1%;
		height: 100vh;
		background-color: white;
	}

	.sidesection {
		padding: 15px;
		border-radius: 10px;
		box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
	}

	.modal {
		z-index: 3;
		display: none;
		padding-top: 100px;
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		overflow: auto;
		background-color: rgba(0, 0, 0, 0.4);
	}

	.modal-content {
		margin: auto;
		background-color: #fff;
		position: relative;
		padding: 0;
		outline: 0;
		width: 600px;
	}

	.modal-container {
		padding: 1em 16px;
		padding-bottom: 1.5em;
	}

	.modal-container:after,
	.modal-container:before {
		content: '';
		display: table;
		clear: both;
	}
</style>
