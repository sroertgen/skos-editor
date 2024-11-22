<script>
	import { concepts, selectedConcept, serializedTurtle } from './conceptStore';
	import { serializeSKOS } from './serialize.js';
	import { writable } from 'svelte/store';
	import { eye, eyeSlash } from 'svelte-awesome/icons';
	import Icon from 'svelte-awesome';

	let conceptSchemeApi = 'http://127.0.0.1:8000/concept-schemes/';
	let conceptSchemeTitle = 'Test';
	let conceptSchemeBase = 'https://w3id.org/';
	let conceptSchemeIdentifier;
  let conceptSchemeDescription = "My wonderful vocabulary."
	let showTurtle = writable(false);

	async function getTurtle() {
		fetch(conceptSchemeApi, {
			method: 'POST',
			mode: 'cors', // no-cors, *cors, same-origin
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(conceptScheme),
			dataType: 'json'
		})
			.then((response) => response.json())
			.then((data) => {
				console.log('Success:', data);
				conceptSchemeTurtle = data;
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	}
	function createTurtle() {
		const data = serializeSKOS(conceptScheme);
		$serializedTurtle = data;
	}
	$: conceptScheme = {
		title: conceptSchemeTitle,
		base: conceptSchemeBase,
		identifier: conceptSchemeIdentifier,
    description: conceptSchemeDescription,
		concepts: $concepts
	};
</script>

<div class="border border-slate-800 rounded-md text-left p-4 m-4 overflow-auto max-h-screen">
	<div class="form-control">
		<label class="label" for="conceptSchemeTitle">
			<span>Title of Concept Scheme:</span>
		</label>
		<input class=" input input-bordered input-sm" type="text" bind:value={conceptSchemeTitle} />

		<label class="label" for="conceptSchemeDescription">
			<span>Description of Concept Scheme:</span>
		</label>
		<input class=" input input-bordered input-sm" type="text" bind:value={conceptSchemeDescription} />

		<label class="label" for="conceptSchemeBase">
			<span>Base of Concept Scheme:</span>
		</label>
		<input 
      class="input input-bordered input-sm" 
      type="text" 
      bind:value={conceptSchemeBase} 
      on:blur={() => {if (!conceptSchemeBase.endsWith("/"))
        {conceptSchemeBase = conceptSchemeBase + "/"}
      }} />
		<label class="label" for="conceptSchemeIdentifier">
			<span>Preferred Namespace URI for Concept Scheme (optional):</span>
		</label>
		<input class="input input-bordered input-sm" type="text" bind:value={conceptSchemeIdentifier} />
	</div>
	<div class="flex flex-row gap-1">
		<button class="btn my-4" on:click={createTurtle} on:click={() => ($showTurtle = true)}
			>Create Turtle 🐢</button
		>
		<button
			class="btn my-4"
			on:click={() => selectedConcept.set({})}
			on:click={() => showTurtle.set(false)}
			on:click={() => concepts.set([])}
			on:click={() => ($serializedTurtle = '')}>Delete all Concepts 🗑️</button
		>
		<button on:click={() => ($showTurtle = !$showTurtle)} class="btn my-4 ml-auto"
			>{#if !$showTurtle}
				<Icon class="mr-2" data={eye} />Show Turtle
			{:else}
				<Icon class="mr-2" data={eyeSlash} />Hide Turtle
			{/if}
		</button>
	</div>
	<br />
	<!-- müssen in andere componente vershoben werden -->
	{#if $showTurtle}
		<textarea value={$serializedTurtle} cols="79" rows="10" />
	{/if}
</div>
