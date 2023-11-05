<script lang="ts">
	import { UserOutline, MapPinAltSolid } from 'flowbite-svelte-icons'
	import { login, user, pawUser } from '$lib/firebase'
	import type { User } from 'firebase/auth'
</script>

<nav class="relative flex flex-row justify-between m-4 p-4 rounded-lg bg-white bg-opacity-80">
	<div class="flex flex-row rounded-sm">
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
				<span class="-m-4">ints</span> ✨
			</div>
		</a>
	</div>
	{#if $user}
		<div class="flex flex-row align-center justify-center items-center px-2 space-x-4">
			{#if $pawUser}
				<p class="animated-gradient-text font-extrabold text-center">
					{$pawUser?.pawPoints} PawPoints ✨
				</p>
			{/if}
			<p>Hi <b>{$user.displayName}</b></p>
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
		<button on:click={login}> Login </button>
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
</style>
