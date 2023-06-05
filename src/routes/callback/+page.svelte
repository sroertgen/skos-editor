<script>
  import {goto} from '$app/navigation'
  import { browser } from '$app/environment';
  import { ghData } from '../gh-store';
  export let data
  ghData.update($ghData => {
    $ghData.user = data.user,
    $ghData.repos = data.repos,
    $ghData.accessToken = data.accessToken
    return $ghData
  })
  $: if (browser) {
  goto("/")
}
</script>

<div>
    <p>Hello {$ghData.user.name}!</p>
    <p>Your repos are</p>
    <ul>
    {#each $ghData.repos as repo}
      <li>{repo.name}</li>
    {/each}
  </ul>
</div>