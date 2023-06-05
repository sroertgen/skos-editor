<script>
  import { concepts, selectedConcept } from "../Editor/conceptStore";
  import NestedList from "./NestedList.svelte";

  $: topConcepts = $concepts.filter((c) => c.broader.length === 0);
</script>

<div
  class="border border-slate-800 rounded-md text-left p-4 m-4 overflow-auto max-h-screen"
>
  <button class="btn p-1 m-1" on:click={concepts.addConcept}>Add Top Concept</button
  >
  <button
    class="btn p-1 m-1"
    on:click={$selectedConcept.identifier &&
      concepts.addNarrowerConcept($selectedConcept.identifier)}
    >Add Narrower Concept</button
  >
  {#each topConcepts as topConcept (topConcept.identifier)}
    <NestedList
      expanded
      children={concepts.getChildren(topConcept.narrower)}
      concept={topConcept}
    />
  {/each}
</div>

<style>
</style>
