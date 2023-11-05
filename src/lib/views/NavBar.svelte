<script lang="ts">
	import { UserOutline, MapPinAltSolid } from 'flowbite-svelte-icons'
	import { login, user, pawUser } from '$lib/firebase'
	import type { User } from 'firebase/auth'

</script>

<nav class="relative flex flex-row justify-between m-4 p-4 rounded-lg bg-white bg-opacity-80">
	<div class="flex flex-row rounded-sm py-1">
		<a
			class="flex text-black text-center px-[14px] -m-2 items-center bg-[#9EE493] rounded-lg no-underline cursor-pointer"
			href="/"
		>
			<div class="flex flex-row gap-x-4 items-center text-center m-auto">
				<img
					src="/pawpoints_transparent.png"
					alt=""
					class="w-8 h-8 transition-all duration-300 hover:scale-125"
				/>
				<div class="flex flex-row space-x-2 text-center m-auto items-center">
					<span class="-m-2">PawP</span>
					<span class="-m-2"><MapPinAltSolid /></span>
				</div>
				<span class="-m-4">ints</span>&nbsp;
			</div>
		</a>
		<a>
		</a>
	</div>
	{#if $user}
		<div
			class="flex flex-row align-center justify-center items-center px-2 space-x-4 text-center mt-1"
		>
			{#if $pawUser}
				<p class="animated-gradient-text font-extrabold text-center">
					{$pawUser?.pawPoints} PawPoints ✨
				</p>
			{/if}
			<p class="user-name text-center">Hi <b>{$user.displayName}</b></p>
			<a class="flex mx-4 select-none text-black px-2 text-center" href="/profile">
				<img
					src={$user
						? $user.photoURL
						: 'https://tse2.mm.bing.net/th?id=OIP.fqSvfYQB0rQ-6EG_oqvonQHaHa&pid=Api&P=0&h=180'}
					alt=""
					class="user-photo rounded"
					width="30"
				/>
			</a>
		</div>
	{:else}
		<button class="rounded-xl py-2 bg-[#9EE493] border-0 p-3 text-base hover-change" on:click={login}>
			Login
		</button>
	{/if}
</nav>

<!-- <ul class="relative m-2.5 p-0 overflow-hidden bg-white rounded-[10px] list-none">
	<li class="flex h-full items-center m-auto float-left">
		<a class="block text-black text-center px-[14px] bg-[#86bbd8]" href="/"> PawPoints </a>
	</li>
	<li class="float-right">
		<a href="/profile" class="block text-black text-center px-[14px] py-4 hover:bg-gray-200">
			<UserOutline />
		</a>
	</li>
</ul> -->

<!-- <ul
	class="relative m-2.5 p-0 overflow-hidden bg-white bg-opacity-80 rounded-[10px] list-none flex justify-between"
>
	<li>
		<a class="block text-black text-center px-[14px] py-4 bg-[#86bbd8] no-underline" href="/"> PawPoints </a>
	</li>
	<li>
		<a href="/profile" class="block text-black text-center px-[14px] py-4 hover:bg-gray-200">
			<UserOutline />
		</a>
	</li>
</ul> -->

<!-- <ul class="relative m-2.5 p-0 overflow-hidden bg-white bg-opacity-80 rounded-[10px] list-none">
	<li class="float-left">
		<a class="block text-black text-center px-[14px] py-4 bg-[#86bbd8]" href="/"> PawPoints </a>
		// This Element
	</li>
	<li class="float-right">
		<a href="/profile" class="block text-black text-center px-[14px] py-4 hover:bg-gray-200">
			<UserOutline />
		</a>
	</li>
</ul> -->

<style>
	@keyframes gradient-animation {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}

	.animated-gradient-text {
		background: linear-gradient(45deg, #cc4b48, #cc884b, #cca048, #cc44cc);
		background-size: 200% 200%;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		animation: gradient-animation 5s ease infinite;
	}

	/* For browsers that do not support the clip property */
	.no-clip {
		background: none;
		-webkit-text-fill-color: initial;
		color: black;
	}

	.user-photo {
		border-radius: 50%;
		opacity: 1;
		transition: 0.4s;
	}

	.user-photo:hover {
		opacity: 0.8;
	}

	.hover-change{
		transition-duration: .4s;
	}

	.hover-change:hover{
		opacity: .8;
		cursor: pointer;
	}

	@media(max-width: 500px) {
		.user-name {
			visibility: hidden;
			width: 0px;
		}
	}

	.modal {
		z-index: 3; display: none; padding-top: 100px; position: fixed; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0, 0, 0, 0.4);
	}

	.modal-content {
		margin: auto; background-color: #fff; position: relative; padding: 0; outline: 0; width: 600px;
	}

	.modal-container {
		padding: 1em 16px; padding-bottom: 1.5em;
	}

	.modal-container:after, .modal-container:before {
		
	}
</style>
