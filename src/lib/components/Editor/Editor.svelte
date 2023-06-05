<script>
  import ConceptScheme from "./ConceptScheme.svelte";
  import Sidebar from "../Sidebar/Sidebar.svelte";
  import { selectedConcept, concepts } from "./conceptStore";
  import Concept from "./Concept.svelte";
</script>

<div class="flex flex-col">
  <ConceptScheme />
  <div class="flex flex-row">
    <div class="sidebar basis-1/3">
      <Sidebar />
    </div>
    <div class="basis-2/3">
      {#if $selectedConcept.identifier}
        <Concept concept={$selectedConcept} />
      {/if}
    </div>
  </div>
</div>
