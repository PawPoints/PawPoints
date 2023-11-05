<script lang="ts">
	import '../../app.postcss'
	import { PlusOutline } from 'flowbite-svelte-icons'
	import { createEventDispatcher } from 'svelte'
	import NavBar from '$lib/views/NavBar.svelte'
	import { onMount } from 'svelte'
	// import { UserOutline } from 'flowbite-svelte-icons'
	import { login, logout, user, pawUser } from '$lib/firebase'
	import type { User } from 'firebase/auth'

	const dispatch = createEventDispatcher()

	let imageUrl: string | ArrayBuffer | null | undefined = '/invis-user.png'

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

<div class="body">
	<div class="container d-flex justify-content-center align-items-center">
		<div class="card">
			<div class="upper">
				<img 
				src="http://images2.fanpop.com/images/photos/5100000/Cats-wallpaper-cats-5194935-1280-1024.jpg" 
				alt="" class="img-fluid"
				style="width: 100%; height: 100%; object-fit: cover;" 
				/>
			</div>
			<div class="user text-center">
				<div class="profile">
					<!-- <img src={user?user.photoURL:'/invis-user.png'} alt="" class="rounded-circle" width="100" /> -->
					<img
						src={$user
							? $user.photoURL
							: 'https://tse2.mm.bing.net/th?id=OIP.fqSvfYQB0rQ-6EG_oqvonQHaHa&pid=Api&P=0&h=180'}
						alt=""
						class="rounded-circle"
						width="100"
					/>
					<!-- <input
						type="file"
						id="file-upload"
						on:change={handleFileChange}
						class="image-upload"
					/>
					<label for="file-upload">
						<div
							class="plus-button absolute right-3 bottom-2 bg-transparent outline-none border-none"
						>
							<PlusOutline class=" text-gray-100" size="lg" />
						</div>
					</label> -->
				</div>
			</div>

			<div class="lower mt-5 text-center">
				{#if $user}
					<h4 class="mb-0">{$user.displayName}</h4>
				{:else}
					<h4 class="mb-0">User Name</h4>
				{/if}
				<!-- <h4 class="mb-0">User Name</h4> -->
				{#if $user}
					<span class="text-muted d-block mb-2">{$user.email}</span>
				{:else}
					<span class="text-muted d-block mb-2">user.email@gmail.com</span>
				{/if}
				<!-- <span class="text-muted d-block mb-2">something@gmail.com</span> -->
				<br />
				{#if $pawUser && $user}
					<div class="d-flex justify-content-between align-items-center mt-4 px-4">
						<div class="stats">
							<h6 class="mb-0">PawPoints</h6>
							<span>{$pawUser.pawPoints}</span>
						</div>
					</div>
				{/if}
				{#if $user}
					<input on:click={logout} type="submit" value="Logout" class="log-out-button" />
				{:else}
					<input on:click={login} type="submit" value="Login" class="log-out-button" />
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	.mb-0 {
		font-size: 24px;
	}

	.mb-2 {
		font-size: 20px;
	}

	.rounded-circle {
		padding-top: 3px;
		border-radius: 50%;
	}

	.image-upload {
		display: none;
	}

	/* .image-fluid{
		height: 5px; 
		object-fit: cover;
	} */

	.plus-button {
		background-color: rgba(100, 100, 100, 0.8);
		transition: background-color 0.2s ease-in-out;
		cursor: pointer;
		/* padding: 8px, 2px; */
		border-radius: 50%;
	}

	.plus-button:hover {
		background-color: rgba(100, 100, 100, 1);
	}

	.stats {
		top: 40px;
	}

	.body {
		position: absolute;
		width: 100vw;
		height: 100vh;
		background-color: #2f4858;
		font-family: 'Poppins', sans-serif;
		font-weight: 300;
	}

	.card {
		width: 700px;
		border: none;
		border-radius: 10px;
		padding: 8px;
		background-color: #fff;
		/* position: relative; */
		height: 500px;
		position: absolute;
		top: calc(50% - 250px);
		left: calc(50% - 350px);
	}

	.upper {
		height: 100px;
	}

	.upper img {
		width: 100%;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
	}

	.lower {
		margin-top: 100px;
	}

	.user {
		position: relative;
	}

	.profile img {
		height: 90px;
		width: 90px;
		margin-top: 2px;
	}

	.profile {
		position: absolute;
		top: -47px;
		left: 43%;
		height: 100px;
		width: 100px;
		border: 5px solid #fff;
		border-radius: 50%;
	}

	.log-out-button {
		margin-top: 30px;
		height: 40px;
		width: 125px;
		font-size: 1.1em;
		border: none;
		transition-duration: 0.4s;
	}

	.log-out-button:hover {
		background-color: #daf7dc;
		cursor: pointer;
	}

	.stats span {
		font-size: 29px;
	}
</style>
