<script>
  export let currentStep
</script>

<ul class="steps steps-horizontal">
  <li class="step step-primary">Choose repo</li>
  <li class:step-primary={currentStep >= 1} class="step">Select file</li>
  <li class:step-primary={currentStep >= 2} class="step">Compare</li>
  <li class:step-primary={currentStep >= 3} class="step">Push</li>
</ul>