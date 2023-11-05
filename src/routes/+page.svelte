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
	import type { User } from 'firebase/auth'

	let displayTrackedCats = true

	let foundCat: FoundCat

	let clickMarker;
	let map;

	onMount(async () => {
		mapboxgl.accessToken =
			'pk.eyJ1IjoidHdpbmtsZWJ1bnoxMDciLCJhIjoiY2xoMmFoMWl2MWF5YjNzbXB2amc3NmdiaiJ9.TtL3czNMJqBCphmq2_arqg'

		map = new mapboxgl.Map({
			container: 'mapcontainer',
			style: 'mapbox://styles/mapbox/streets-v12',
			center: [-95.1266301248878, 44.05209890150269],
			zoom: 4
		})

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
				addCatMarker(data[i]);
			}
		})
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
		addCatMarker(cat);
	});

	function updateDispalyTrackedCats(display: boolean) {
		if (display && clickMarker) {
			clickMarker.remove();
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
					style="width: 10.65vw;"
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
					style="width: 10.65vw;"
					on:click={() => updateDispalyTrackedCats(false)}>Found a Cat?</label
				>
			</div>
		</center>
		<br />
		<div class="sidesection">
			{#if displayTrackedCats}
				<TrackCats />
			{:else}
				<FoundCat bind:this={foundCat} />
			{/if}
		</div>
	</div>


	<div class="questionmark" onclick='document.getElementById("modal").style.display="block";'>
		<center>
			<QuestionCircleSolid class="w-13 h-13" />
		</center>
	</div>

	<div id="modal">
		<div id="modal-content">
			<div id="modal-container">
				<span onclick="document.getElementById('modal').style.display='none'"
				style="border:none;display:inline-block;padding:8px 16px;vertical-align:middle;overflow:hidden;text-decoration:none;color:inherit;background-color:inherit;text-align:center;cursor:pointer;white-space:nowrap; position:absolute;right:0;top:0;">&times;</span>
				<br>
				<h3><center>How to Use</center></h3>
				<br>
				<p>FUCK FUCK FUCK FUCKITY FUCK FUCK FUCK FUCK FUCK FUCK FUCK FUCKITY FUCK FUCK FUCK FUCK FUCK FUCK FUCK FUCKITY FUCK FUCK FUCK FUCK FUCK FUCK FUCK FUCKITY FUCK FUCK FUCK FUCK FUCK FUCK FUCK FUCKITY FUCK FUCK FUCK FUCK FUCK FUCK FUCK FUCKITY FUCK FUCK FUCK FUCK FUCK FUCK FUCK FUCKITY FUCK FUCK FUCK FUCK FUCK FUCK FUCK FUCKITY FUCK FUCK FUCK FUCK</p>
				<br>
				<p>FUCK FUCK FUCK FUCKITY FUCK FUCK FUCK FUCK FUCK FUCK FUCK FUCKITY FUCK FUCK FUCK FUCK FUCK FUCK FUCK FUCKITY FUCK FUCK FUCK FUCK FUCK FUCK FUCK FUCKITY FUCK FUCK FUCK FUCK FUCK FUCK FUCK FUCKITY FUCK FUCK FUCK FUCK FUCK FUCK FUCK FUCKITY FUCK FUCK FUCK FUCK FUCK FUCK FUCK FUCKITY FUCK FUCK FUCK FUCK FUCK FUCK FUCK FUCKITY FUCK FUCK FUCK FUCK ITS 3AM KILL ME NOW BITCHHHHHHHHH</p>
				<br>
			</div>
		</div>
	</div>
	
</div>

<style>
	:global(.marker) {
		width: 50px;
		height: 50px;
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

	.questionmark {
		float: right;
		background-color: rgba(255, 255, 255, 0.5);
		width: 5vw;
		height: 5vw;
		bottom: 3.5vh;
		right: 1vh;
		position: absolute;
		border-radius: 50%;
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
		background-color: white;
		padding: 15px;
		border-radius: 10px;
		box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.25);
	}

	#modal {
		z-index:3;display:none;padding-top:100px;position:fixed;left:0;top:0;width:100%;height:100%;overflow:auto;background-color:rgb(0,0,0);background-color:rgba(0,0,0,0.4);
	}

	#modal-content {
		margin:auto;background-color:#fff;position:relative;padding:0;outline:0;width:600px;
	}

	#modal-container {
		padding:0.01em 16px;
	}

	#modal-container:after, #modal-container:before {
		content:"";display:table;clear:both
	}
</style>
