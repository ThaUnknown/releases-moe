<script context='module' lang='ts'>
  import { metadata } from '$lib/app/stores'
  import { ProgressBar } from '@prgm/sveltekit-progress-bar'
  import Nav from '$lib/components/Nav.svelte'
  import { site } from '$lib/config'
  import '../app.pcss'
  import { Toaster } from 'svelte-sonner'
  import { progress } from '$lib/components/entries/query'
</script>

<script lang='ts'>
  import { page } from '$app/stores';
  $: title = $metadata.title ? $metadata.title + ' | ' + site.name : site.name
  $: description = $metadata.description ?? site.description
</script>

<!-- <svelte:window on:unhandledrejection={(e) => { alerts.error(e.reason.toString()) }} /> -->

<svelte:head>
  <title>{title}</title>
  <meta name='description' content={description} />
</svelte:head>

<ProgressBar zIndex={100} bind:this={$progress} />
<Nav ids={$page.data.ids} search={$metadata.title && $metadata.title !== 'Home'} />
<Toaster visibleToasts={3} position='top-right' theme='dark' richColors duration={10000} />

<div class='container mx-auto py-5 flex-grow flex'>
  <slot />
</div>
