<script context='module'>
  import { metadata } from '$lib/app/stores'
  import Nav from '$lib/components/Nav.svelte'
  import { site } from '$lib/config'
  import '../app.css'
  import 'quartermoon/css/quartermoon-variables.css'
  import { Toaster } from 'svelte-sonner'
</script>

<script lang='ts'>
  $: title = $metadata.title ? $metadata.title + ' | ' + site.name : site.name
  $: description = $metadata.description ?? site.description
</script>

<!-- <svelte:window on:unhandledrejection={(e) => { alerts.error(e.reason.toString()) }} /> -->

<svelte:head>
  <title>{title}</title>
  <meta name='description' content={description} />
</svelte:head>

<Nav />
<Toaster visibleToasts={3} position='top-right' theme='dark' richColors duration={10000} />
<div class='content-wrapper'>
  <div class='container pt-20'>
    <slot />
  </div>
</div>
