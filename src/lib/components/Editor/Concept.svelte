<script>
  import { nanoid } from "nanoid";
  import ConceptProperty from "./ConceptProperty.svelte";
  import { concepts, selectedConcept } from "./conceptStore";

  export let concept;
  let successSubjectChange = true;

  $: conceptProperties = $concepts.find(
    (c) => c.identifier === concept.identifier
  ).properties;

  function addProperty() {
    conceptProperties = conceptProperties.concat({
      id: nanoid(5),
      predicate: {},
      object: {},
    });
    concepts.updateProperties(concept.identifier, conceptProperties);
  }

  function deleteProperty(id) {
    conceptProperties = conceptProperties.filter((c) => c.id != id);
    concepts.updateProperties(concept.identifier, conceptProperties);
  }

  function handleIdentifierChange(event) {
    const newIdentifier = event.target.value;
    successSubjectChange = concepts.updateSubject(
      concept.identifier,
      newIdentifier
    );
  }

  function deleteConcept() {
    concepts.deleteConcept(concept.identifier)
    selectedConcept.set({})
  }
</script>

<div
  class="border border-slate-800 rounded-md text-left p-4 m-4 overflow-auto max-h-screen"
>
<div class="form-control flex flex-row">
  <label class="label" for="subjectChange">
    <span>Concept Identifier:</span>
    <br />
  </label>
  <input
  id="subjectChange"
  class="input input-bordered input-sm {!successSubjectChange
      ? 'input-error'
      : ''}"
    on:change={handleIdentifierChange}
    value={concept.subject}
    />
  </div>

  <div flex flex-col w-full>
    {#each conceptProperties as conceptProperty (conceptProperty.id)}
      <ConceptProperty
        conceptIdentifier={concept.identifier}
        {conceptProperty}
        deleteProperty={() => deleteProperty(conceptProperty.id)}
      />
      <div class="divider" />
    {/each}
  </div>

  <button class="btn" on:click={addProperty}>Add Predicate</button>
  <!-- TODO add toggle function so when button is clicked its always expanded -->
  <button on:click={deleteConcept} class="btn">🗑️ Delete Concept</button>
</div>
