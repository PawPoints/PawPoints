<script lang="ts">
	import '../../app.postcss'
	import { PlusOutline } from 'flowbite-svelte-icons'

	import { createEventDispatcher } from 'svelte'

	const dispatch = createEventDispatcher()

	let imageUrl: string | ArrayBuffer | null | undefined = '/no_cat_photo.png'

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
</script>

<div>
	<div class="add-cat">
		<div class="cat-image relative">
			<img src={imageUrl} alt="" />
			<input type="file" id="file-upload" on:change={handleFileChange} class="image-upload" />
			<label for="file-upload">
				<div class="plus-button absolute right-2 bottom-3 bg-transparent outline-none border-none">
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
				/>
				<p class="m-0">Breed</p>
				<input
					placeholder="Siamese"
					class="m-0 p-0 border-r-0 border-l-0 border-t-0"
					type="text"
				/>
				<p class="m-0">Description</p>
				<textarea
					placeholder="A nice cat description"
					class="border-r-0 border-l-0 border-t-0"
				/>
				<p class="m-0">Location</p>
				<input
					placeholder="1234 Main St"
					class="m-0 p-0 border-r-0 border-l-0 border-t-0"
					type="text"
				/>
			</div>
			<button class="button">Add Cat</button>
		</div>
	</div>
</div>

<style>
    /* Base style for the button */
    .button {
        background-color: #2F4858; /* Main color for the button */
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
		box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3); /* Slight drop shadow */
		object-fit: cover; /* This will cover the area of the box without stretching the image */
	}

	.cat-image {
		width: 100%;
	}

	input:focus,
	textarea:focus {
		outline: none;
        border-color: #83BD85;
	}

	textarea {
		/* width: 200px; */
		height: 50px;
	}
</style>
