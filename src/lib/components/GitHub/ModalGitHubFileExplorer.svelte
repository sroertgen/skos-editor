<script>
	import Icon from 'svelte-awesome/components/Icon.svelte';
	import { folder, folderOpen, fileO } from 'svelte-awesome/icons';
	import { modalSelectedFile } from '../../../routes/gh-store';

	export let children;
	export let sha;
	export let name;
	export let expanded = false;

	function toggle(event) {
		expanded = !expanded;
		if (!children.length) {
			if ($modalSelectedFile === event.target.id) {
				$modalSelectedFile = null;
			} else {
				$modalSelectedFile = event.target.id;
			}
		}
		console.log($modalSelectedFile);
		console.log(event.target.id);
	}
</script>

<span
	id={sha}
	class:bg-slate-200={sha === $modalSelectedFile}
	class="p-1 block hover:bg-slate-200 cursor-pointer"
	on:click={toggle}
>
	{#if children.length && expanded}
		<Icon data={folderOpen} />
	{:else if children.length && !expanded}
		<Icon data={folder} />
	{:else}
		<Icon data={fileO} />
	{/if}
	{name}
</span>

{#if expanded && children.length}
	<ul class="ml-2 pl-1 border-l-2 border-sky-400">
		{#each children as child}
			<li>
				<svelte:self name={child.name} children={child.children} />
			</li>
		{/each}
	</ul>
{/if}
