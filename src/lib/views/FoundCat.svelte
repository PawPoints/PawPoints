<script lang="ts">
    import '../../app.postcss'
    import { PlusOutline } from 'flowbite-svelte-icons';

    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    let imageUrl: string | ArrayBuffer | null | undefined = "https://files.oaiusercontent.com/file-WKaExy4PcokyrrwXL1Wx9IHH?se=2023-11-04T21%3A42%3A16Z&sp=r&sv=2021-08-06&sr=b&rscc=max-age%3D31536000%2C%20immutable&rscd=attachment%3B%20filename%3Dc11770d5-65c0-409a-8765-306c23ce2cf8.webp&sig=do3C9IuurrUvBDa4hcLbexySa/gaVXt0COQGlUBs8lk%3D";

    function handleFileChange(event: Event) {
        const input = event.target as HTMLInputElement;
        if (!input.files || input.files.length === 0) {
            imageUrl = null;
            return;
        }
        
        const file = input.files[0];
        const reader = new FileReader();

        reader.onload = (e: ProgressEvent<FileReader>) => {
            imageUrl = e.target?.result;            
            dispatch('imageLoaded', { image: imageUrl });
        };

        reader.readAsDataURL(file);
    }
</script>

<div>
    <div class="add-cat">
        <div class="cat-image relative">
            <img src={imageUrl} alt="">
            <input type="file" id="file-upload" on:change={handleFileChange} class="image-upload">
            <label for="file-upload">
                <div class="plus-button absolute right-2 bottom-3 bg-transparent outline-none border-none">
                    <PlusOutline class=" text-gray-100" size="lg"/>
                </div>
            </label>
        </div>
        <div class="cat-form">
            <div class="cat-props">
                <p class="m-0">Breed</p>
                <input placeholder="Siamese" class="m-0 p-0 border-r-0 border-l-0 border-t-0" type="text">
                <p class="m-0">Description</p>
                <textarea placeholder="A nice cat description" class="border-r-0 border-l-0 border-t-0"/>
                <p class="m-0">Location</p>
                <input placeholder="1234 Main St" class="m-0 p-0 border-r-0 border-l-0 border-t-0" type="text">
            </div>
            <button>Add Cat</button>
        </div>
        <!-- <form class="cat-props flex flex-col gap-2" action="/submit-cat" method="post">
            <div class="cat-prop gap-1">
              <label class="m-0">Breed
                <input name="breed" placeholder="Siamese" class="m-0 p-0 border-r-0 border-l-0 border-t-0" type="text">
              </label>
            </div>
            <div class="cat-prop gap-1">
              <label class="m-0">Description
                <textarea name="description" placeholder="A nice cat description" class="border-r-0 border-l-0 border-t-0"></textarea>
              </label>
            </div>
            <div class="cat-prop gap-1">
              <label class="m-0">Location
                <input name="location" placeholder="1234 Main St" class="m-0 p-0 border-r-0 border-l-0 border-t-0" type="text">
              </label>
            </div>
            <button type="submit">Add Cat</button>
        </form>           -->
    </div>
</div>

<style>
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


    .cat-prop {
        display: flex;
        font-size: 20px;
        
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

    input:focus, textarea:focus {
        outline: none;
    }

    textarea {
        /* width: 200px; */
        height: 50px;
    }
</style>