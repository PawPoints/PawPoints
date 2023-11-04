<script lang="ts">
    import '../../app.postcss'
</script>

<div>
    <div class="add-cat">
        <img src="https://hips.hearstapps.com/hmg-prod/images/cute-cat-photos-1593441022.jpg?crop=0.670xw:1.00xh;0.167xw,0&resize=640:*" alt="">
        <div class="cat-props flex flex-col gap-2">
            <div class="cat-prop gap-1">
                <p class="m-0">Breed</p>
                <input placeholder="Siamese" class="m-0 p-0 border-r-0 border-l-0 border-t-0" type="text">
            </div>
            <div class="cat-prop gap-1">
                <p class="m-0">Description</p>
                <textarea placeholder="A nice cat description" class="border-r-0 border-l-0 border-t-0"/>
            </div>
            <div class="cat-prop gap-1">
                <p class="m-0">Location</p>
                <input placeholder="1234 Main St" class="m-0 p-0 border-r-0 border-l-0 border-t-0" type="text">
            </div>
            <button>Add Cat</button>
        </div>
    </div>
</div>

<style>
    .add-cat {
        display: flex;
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
        width: 20%;
        aspect-ratio: 1 / 1; /* Make the width and height equal */
        border-radius: 10px; /* Rounded corners */
        box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3); /* Slight drop shadow */
        object-fit: cover; /* This will cover the area of the box without stretching the image */
    }

    input:focus, textarea:focus {
        outline: none;
    }

    textarea {
        width: 200px;
        height: 50px;
    }
</style>