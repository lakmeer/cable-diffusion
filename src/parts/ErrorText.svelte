
<div class="ErrorText">
  <p>
    <slot />
  </p>
</div>


<style lang="postcss">

  .ErrorText {
    display: block;
    margin: 0;
    padding: 0.3rem 0.6rem;
    background: var(--error);
    color: var(--node-text-color);
    font-size: 0.9rem;
    font-weight: bold;
    border-radius: 4px;
    line-height: 1.1rem;

    p { margin: 0 }
  }

</style>
