<script>
	import { concepts, selectedConcept } from '../Editor/conceptStore';
	import Icon from 'svelte-awesome';
	import { chevronDown, chevronRight } from 'svelte-awesome/icons';

	export let concept;
	export let children = [];
	export let expanded = false;

	let current = null;

	function toggle() {
		expanded = !expanded;
		selectedConcept.set(concept);
		current = concept.identifier;
	}

	function scrollIntoView({ target }) {
		const el = document.getElementById(target.getAttribute('href'));
		selectedConcept.set($concepts.find((c) => c.identifier == el.id));
		current = el.id;
		if (!el) return;
		el.scrollIntoView({
			behavior: 'smooth'
		});
	}
	function getLabel(concept) {
		const label = concept.properties.find((c) => c.predicate.predicate == 'skos:prefLabel');
		return label ? label.object.objectValue : concept.subject;
	}

	$: label = getLabel($concepts.find((c) => c.identifier === concept.identifier));
</script>

<ul>
	<div class="flex flex-row items-center gap-1">
		<li>
			<button
				class="ml-1 btn btn-xs btn-circle"
				class:invisible={!children.length}
				on:click={toggle}><Icon data={expanded ? chevronDown : chevronRight} /></button
			>
			<button
				class:bg-orange-400={current === $selectedConcept.identifier}
				class:hover:bg-orange-400={current === $selectedConcept.identifier}
				class="px-1 rounded hover:bg-orange-200"
				id={concept.identifier}
				href={concept.identifier}
				on:click|preventDefault={scrollIntoView}>{label}</button
			>
		</li>
	</div>

	{#if expanded && children.length}
		<ul class="ml-4 list-none border-l-2 border-r-0 border-slate-400">
			{#each children as child}
				<li>
					{#if child.narrower && child.narrower}
						<svelte:self expanded concept={child} children={concepts.getChildren(child.narrower)} />
					{:else}
						<svelte:self concept={child} />
					{/if}
				</li>
			{/each}
		</ul>
	{/if}
</ul>
