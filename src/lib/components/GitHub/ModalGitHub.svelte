<script>
	import ModalGitHubStep from './ModalGitHubStep.svelte';
	import ModalGitHubFileExplorer from './ModalGitHubFileExplorer.svelte';
	import ModalGitHubFileDiff from './ModalGitHubFileDiff.svelte';
	import { ghData, modalSelectedFile } from '../../../routes/gh-store';

	let selected;
	let currentStep = 0;
	let selectedRepo = {};

	function toggle(id) {
		console.log(id);
		console.log(selected);
		if (selected === id) {
			selected = null;
		} else {
			selected = id;
		}
	}
	async function getRepoContent() {
		const res = await fetch(
			`https://api.github.com/repos/${$ghData.user.login}/${selectedRepo.name}/contents/`
		);
		const content = await res.json();
		console.log(content);
		return content;
	}

	function createTree(input) {
		const result = input.reduce((r, p, i) => {
			if (!(p instanceof Object)) {
				p = { path: p, id: i };
			}
			const path = p.path && p.path.substr(0, 1) == '/' ? p.path : '/' + p.path;
			const [root, ...names] = path.split('/');
			const last = names[names.length - 1];
			names.reduce((q, name) => {
				let temp = q.find((o) => o.name === name);
				//const id = p.name == name ? p.id : undefined;
				const id = last == name ? p.id : undefined;
				const sha = p.sha;
				if (!temp) {
					q.push((temp = { id, name, sha, children: [] }));
				}
				return temp.children;
			}, r);
			return r;
		}, []);
		console.log(result);
		return result;
	}

	$: headers = {
		Accept: 'application/vnd.github+json',
		Authorization: `Bearer ${$ghData.accessToken}`
	};

	async function getRepoTree() {
		const branchUrl = `${selectedRepo.branches_url.replace('{/branch}', '/master')}`;
		const branch = await fetch(branchUrl, {
			headers: headers
		}).then((r) => r.json());
		const treeUrl =
			`${selectedRepo.trees_url.replace('{/sha}', '/' + branch.commit.sha)}` +
			'?' +
			new URLSearchParams({
				recursive: 'true'
			});
		const treeData = await fetch(treeUrl, {
			headers: headers
		}).then((r) => r.json());
		const tree = createTree(treeData.tree);
		$ghData.treeData = { ...$ghData.treeData, [selected]: treeData };
		return tree;
	}

	async function getFile() {
		const filePath = $ghData.treeData[selectedRepo.id].tree.find(
			(e) => e.sha === $modalSelectedFile
		).path;
		const repoContentUrl = `${selectedRepo.contents_url.replace('{+path}', filePath)}`;
		const contentTree = await fetch(repoContentUrl, {
			headers: {
				Accept: 'application/vnd.github+json',
				Authorization: `Bearer ${$ghData.accessToken}`
			}
		}).then((r) => r.json());
		const fileContent = atob(contentTree.content);
		return fileContent;
	}
	$: selectedRepo = $ghData.repos.find((e) => e.id === selected);
</script>

<section>
	<input type="checkbox" id="my-modal" class="modal-toggle" />
	<div class="modal">
		<div class="modal-box overflow-y-auto">
			<ModalGitHubStep {currentStep} />
			<div class="flex w-full items-center">
				<!-- TODO move steps to components -->
				{#if currentStep === 0}
					<div
						class="overflow-auto overscroll-contain grid h-60 flex-grow card bg-base-300 rounded-box"
					>
						<ul>
							{#each $ghData.repos as repo}
								<li
									id={repo.id}
									on:click={toggle(repo.id)}
									class="card p-1 m-1 hover:bg-sky-700 shadow-xl"
									class:bg-base-100={repo.id !== selected}
									class:bg-sky-700={repo.id === selected}
								>
									<div class="card-body">{repo.name}</div>
								</li>
							{/each}
						</ul>
					</div>
					<div class="divider divider-horizontal" />
					<button class="btn btn-disabled"> Create new </button>
				{/if}
			</div>

			{#if currentStep === 1}
				{#await getRepoTree()}
					<p>Loading repo...</p>
					<svg class="animate-spin h-5 w-5 mr-3 ..." viewBox="0 0 24 24">
						<!-- TODO add loading spinner -->
					</svg>
				{:then treeData}
					{#each treeData as data}
						<ModalGitHubFileExplorer sha={data.sha} name={data.name} children={data.children} />
					{/each}
				{/await}
			{/if}

			{#if currentStep === 2}
				{#await getFile()}
					<p>Getting file content...</p>
				{:then file}
					<ModalGitHubFileDiff repoFile={file} />
				{/await}
			{/if}

			<div class="modal-action">
				<button
					on:click={() => (currentStep === 0 ? (currentStep = 0) : (currentStep -= 1))}
					class:btn-disabled={currentStep === 0}
					class="btn">Back</button
				>
				<button
					on:click={() => (currentStep === 3 ? (currentStep = 3) : (currentStep += 1))}
					class:btn-disabled={(currentStep === 0 && !selected) ||
						(currentStep === 1 && $modalSelectedFile === null)}
					class="btn">Next</button
				>
				<label for="my-modal" class="btn">Close</label>
			</div>
		</div>
	</div>
</section>
