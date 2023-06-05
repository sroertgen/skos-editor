<script>
	import { languages, skosPredicates, literals } from './constants';
	import { concepts } from './conceptStore';
	import { afterUpdate, onMount } from 'svelte';
	import Icon from 'svelte-awesome';
	import trashO from 'svelte-awesome/icons/trashO';

	let selectableLanguages = Object.fromEntries(
		skosPredicates
			.filter((p) => p.valueType === 'Literal')
			.map((e) => {
				return [e.predicate, languages];
			})
	);

	export let conceptProperty;
	export let conceptIdentifier;
	export let deleteProperty = () => {};

	let predicate = conceptProperty.predicate;
	let object = conceptProperty.object;
	let propertyId = conceptProperty.id;
	let valueForObject = conceptProperty.object.objectValue;
	let objectType = conceptProperty.object.objectType;

	function findSelectedLanguagesForLiteral(literal) {
		const selectedLangs = $concepts
			.find((c) => c.identifier === conceptIdentifier)
			.properties.filter((p) => p.predicate.predicate === literal)
			.map((o) => o.object.objectType);
		return [[literal], selectedLangs];
	}

	function getSelectableLanguages() {
		const selectedLangs = Object.fromEntries(
			literals.map((l) => findSelectedLanguagesForLiteral(l))
		);
		selectableLanguages = Object.fromEntries(
			literals.map((e) => {
				return [[e], languages.filter((l) => !selectedLangs[e].includes(l))];
			})
		);
		return selectableLanguages;
	}

	afterUpdate(() => {
		concepts.updateObject(conceptIdentifier, propertyId, predicate, object);
		selectableLanguages = getSelectableLanguages();
	});

	$: object = { objectValue: valueForObject, objectType: objectType };
</script>

<div class="form-control flex flex-row card bg-base-300 rounded-box p-5">
	<div class="basis-1/4 m-1">
		<label for="predicate" class="label">
			<span>Select a Predicate:</span>
		</label>
		<select class="select select-sm select-bordered" id="predicate" bind:value={predicate}>
			<option value="none" selected disabled hidden>Select a Predicate</option>
			{#each skosPredicates as predicate}
				<option value={predicate}>
					{predicate.predicate}
				</option>
			{/each}
		</select>
	</div>

	<div class="basis-1/4 m-1">
		<label for="object-value" class="label">
			<span>Value:</span>
		</label>
		<input
			id="object-value"
			class="input input-bordered input-sm"
			disabled={!predicate.predicate || null}
			type="text"
			placeholder={!predicate.predicate ? 'Select a Predicate first' : 'Enter a value'}
			bind:value={valueForObject}
		/>
	</div>
	{#if predicate.valueType == 'Literal'}
		<div class="basis-1/4 m-1">
			{#if predicate.dataType == 'Language'}
				<label for="object-language" class="label">
					<span>Language:</span>
				</label>
				<select
					id="object-language"
					class="select select-sm select-bordered"
					bind:value={objectType}
				>
					<option value="none" selected disabled hidden>Select a Language</option>
					{#each languages as language}
						{#if objectType == language}
							<option selected value={language}>{language}</option>
						{:else if !selectableLanguages[predicate.predicate].includes(language)}
							<option disabled value={language}>{language}</option>
						{:else}
							<option value={language}>{language}</option>
						{/if}
					{/each}
				</select>
			{:else}
				<label for="object-type" class="label">
					<span>Object Type:</span>
				</label>
				<input
					id="object-type"
					class="input input-bordered input-sm"
					type="text"
					bind:value={objectType}
				/>
			{/if}
		</div>
	{/if}
	<button class="btn btn-sm ml-auto mt-auto m-1" on:click={deleteProperty}
		><Icon data={trashO} />
	</button>
</div>
