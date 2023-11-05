<script lang="ts">
	import '../../app.postcss'
	import { PlusOutline } from 'flowbite-svelte-icons'
	import { createEventDispatcher } from 'svelte'
	import type { Cat } from '$lib/types/cat.d.ts'
	import type { CatLocation } from '$lib/types/cat_location.d.ts'
	import { writeCat } from '$lib/firebase'

	const dispatch = createEventDispatcher()

	let imageUrl: string | ArrayBuffer | null | undefined = '/no_cat_photo.png'
	let name = ''
	let breed = ''
	let description = ''
	let location: CatLocation | null = null
	$: canAdd =
		name != '' &&
		breed != '' &&
		description != '' &&
		location != null &&
		imageUrl != '/no_cat_photo.png'

	export function updateLocation(lc: CatLocation) {
		location = lc
	}

	function handleFileChange(event: Event) {
		const input = event.target as HTMLInputElement
		if (!input.files || input.files.length === 0) {
			imageUrl = null
			return
		}

		const file = input.files[0]
		const reader = new FileReader()

		reader.onload = (e: ProgressEvent<FileReader>) => {
			imageUrl = e.target?.result
			dispatch('imageLoaded', { image: imageUrl })
		}

		reader.readAsDataURL(file)
	}

	function addCat() {
		let cat: Omit<Cat, 'firebaseDocId'> = {
			name,
			breed,
			description,
			location,
			image: imageUrl as string,
			lastSeen: new Date(),
			lastFed: new Date()
		}
		writeCat(cat)
		name = ''
		breed = ''
		description = ''
		location = null
		imageUrl = '/no_cat_photo.png'
	}
</script>

<!-- <div>
	<div class="add-cat">
		<div class="cat-image relative">
			<img src={imageUrl} alt="" />
			<input type="file" id="file-upload" on:change={handleFileChange} class="hidden" />
			<label for="file-upload">
				<div
					class="bg-[r\ hover:bg-rgba(100, 100, 100, 1) transition duration-200 ease-in-out cursor-pointer px-0.5 py-2 rounded-[5px] absolute right-2 bottom-3 bg-transparent outline-none border-none"
				>
					<PlusOutline class="text-gray-100" size="lg" />
				</div>
			</label>
		</div>
		<div class="cat-form">
			<div class="cat-props">
				<p class="m-0">Name</p>
				<input
					placeholder="Ol' Johnny"
					class="m-0 p-0 border-r-0 border-l-0 border-t-0"
					type="text"
					bind:value={name}
				/>
				<p class="m-0">Breed</p>
				<input
					placeholder="Siamese"
					class="m-0 p-0 border-r-0 border-l-0 border-t-0"
					type="text"
					bind:value={breed}
				/>
				<p class="m-0">Description</p>
				<textarea
					placeholder="A nice cat description"
					class="border-r-0 border-l-0 border-t-0"
					bind:value={description}
				/>
				<p class="m-0">Location</p>
				<p>
					{#if location}
						{location?.lat}, {location?.lng}
					{:else}
						Click on the Map
					{/if}
				</p>
			</div>
			<button
				disabled={!canAdd}
				on:click={addCat}
				class={" inline-block bg-[#2f4858] hover:bg-[#456578] border-none rounded text-white px-2.5 py-2.5 text-center text-base mx-1 my-0.5 duration-[400ms] cursor-pointer" + (canAdd ? '' : ' opacity-50 cursor-not-allowed')}
			>
				Add Cat
			</button>
		</div>
	</div>
</div> -->

<div>
	<div class="add-cat">
		<div class="cat-image relative">
			<img src={imageUrl} alt="" />
			<input type="file" id="file-upload" on:change={handleFileChange} class="image-upload" />
			<label for="file-upload">
				<div
					class="plus-button absolute right-2 bottom-3 bg-transparent outline-none border-none"
				>
					<PlusOutline class=" text-gray-100" size="lg" />
				</div>
			</label>
		</div>
		<div class="cat-form">
			<div class="cat-props">
				<p class="m-0">Name</p>
				<input
					placeholder="Ol' Johnny"
					class="m-0 p-0 border-r-0 border-l-0 border-t-0"
					type="text"
					bind:value={name}
				/>
				<p class="m-0">Breed</p>
				<input
					placeholder="Siamese"
					class="m-0 p-0 border-r-0 border-l-0 border-t-0"
					type="text"
					bind:value={breed}
				/>
				<p class="m-0">Description</p>
				<textarea
					placeholder="A nice cat description"
					class="border-r-0 border-l-0 border-t-0"
					bind:value={description}
				/>
				<p class="m-0">Location</p>
				<p>
					{#if location}
						{location?.lat}, {location?.lng}
					{:else}
						Click on the Map
					{/if}
				</p>
			</div>
			<button disabled={!canAdd} on:click={addCat} class="button">Add Cat</button>
		</div>
	</div>
</div>

<style>
	/* Base style for the button */
	.button {
		background-color: #2f4858; /* Main color for the button */
		border: none;
		border-radius: 4px;
		color: white; /* Text color */
		padding: 10px 20px;
		text-align: center;
		text-decoration: none;
		display: inline-block;
		font-size: 16px;
		margin: 4px 2px;
		transition-duration: 0.4s; /* Smooth transition for hover effect */
		cursor: pointer;
	}

	.button:hover {
		background-color: #456578; /* Lighter shade for hover state */
	}

	.button:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}

	.plus-button {
		background-color: rgba(100, 100, 100, 0.8);
		transition: background-color 0.2s ease-in-out;
		cursor: pointer;
		padding: 2px 8px;
		border-radius: 5px;
	}

	.image-upload {
		display: none;
	}
	.plus-button:hover {
		background-color: rgba(100, 100, 100, 1);
	}

	.cat-props {
		display: grid;
		grid-template-columns: auto 1fr;
		align-items: start;
		column-gap: 10px;
		row-gap: 10px;
	}

	.cat-form {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.add-cat {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	* {
		font-family: 'Roboto', sans-serif;
	}

	img {
		width: 100%;
		aspect-ratio: 1 / 1; /* Make the width and height equal */
		border-radius: 10px; /* Rounded corners */
		box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.1); /* Slight drop shadow */
		object-fit: cover; /* This will cover the area of the box without stretching the image */
	}

	.cat-image {
		width: 100%;
	}

	input:focus,
	textarea:focus {
		outline: none;
		border-color: #83bd85;
	}

	textarea {
		/* width: 200px; */
		height: 50px;
	}
</style>
