<script lang="ts">
    import { PlusOutline } from 'flowbite-svelte-icons';

    export let visibility: boolean;
</script>

{#if visibility}
    <div class="modal absolute">
        test
    </div>
    <!-- <div class="modal">
        <div class="modal-content">
            <div class="modal-container">
                <span onclick="document.getElementById('cat-modal').style.display='none'"
                    style="border:none;display:inline-block;padding:8px 16px;vertical-align:middle;overflow:hidden;text-decoration:none;color:inherit;background-color:inherit;text-align:center;cursor:pointer;white-space:nowrap; position:absolute;right:0; top:0;"
                    data-svelte-h="svelte-170515b">
                    x
                </span>
                <h3><center>Update Cat Entry</center></h3>
                <div class="cat-image relative">
                    <img src="/no_cat_photo.png" alt=""/>
                    <input type="file" id="file-upload" class="image-upload s-Yk8QVQxv_yuS"> 
                    <label for="file-upload">
                        <div class="plus-button absolute right-2 bottom-3 bg-transparent outline-none border-none">
                            <PlusOutline class=" text-gray-100" size="lg" />
                        </div>
                    </label>
                </div>
            </div>
        </div>
    </div> -->
{/if}

<style>
    .modal {
        display: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.5);
    }
</style>