<script>
	import * as Diff from 'diff';

	export let repoFile;
	let newFile = repoFile;

	const one = 'beep boop';
	const other = 'beep boob blah';

	import CodeMirror from 'svelte-codemirror-editor';
	import { javascript } from '@codemirror/lang-javascript';

	let value = '';

</script>

<!-- <CodeMirror bind:value lang={javascript()} /> -->
<div class="flex flex-row">
	<textarea class="basis-1/2" cols="30" rows="10" contenteditable="true">Hello <span style="color: blue">World</span></textarea>
	<textarea bind:value={newFile} class="basis-1/2" cols="30" rows="10" />
</div>
