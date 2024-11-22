<script>
	import { ghData } from './gh-store';
	import ModalGitHub from '$components/GitHub/ModalGitHub.svelte';

	import Editor from '$components/Editor/Editor.svelte';
	// import Import from '$components/Import/Import.svelte';
	let mode = 'editor';
	let enableUpload = false;
	$: authenticated = $ghData.accessToken ? true : false;
</script>

<svelte:head>
	<title>SKOS-Editor</title>
	<meta name="description" content="Basic SKOS-Editor" />
</svelte:head>

<main>
	<h1>SKOS-Editor</h1>
	{#if mode == 'none'}
		<button on:click={() => (mode = 'editor')}>Create New Vocab</button>
		<button on:click={() => (mode = 'import')}>Import Vocab</button>
	{:else if mode == 'editor'}
		<Editor />
	{:else if mode == 'import'}
		<Import />
	{/if}
	{#if enableUpload}
		{#if authenticated}
			<p>Yay! Authenticated</p>
		{:else}
			<a href="/login">
				<button>Login to Github</button>
			</a>
		{/if}
		<!-- The button to open modal -->
		<label for="my-modal" class="btn modal-button">open modal</label>
		<ModalGitHub />
	{/if}
</main>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}

	.welcome {
		display: block;
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
	}

	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
	}
</style>
