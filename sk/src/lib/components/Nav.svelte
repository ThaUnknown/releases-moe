<script lang='ts' context='module'>
  import { base } from '$app/paths'
  import { page } from '$app/stores'
  import { authModel, client, providerLogin, logout } from '../pocketbase/index.js'
  import { toast } from 'svelte-sonner'

  window.t = toast

  export const authCollection = 'users'

  const coll = client.collection(authCollection)

  const authMethods = coll.listAuthMethods({ $autoCancel: false })

  client.authStore.onChange((token, model) => {
    if (model) {
      const { name, username } = model
      toast.success(`Signed in as ${username || name}`)
    } else {
      toast.success('Signed out')
    }
  }, false)

  const links = [
    ['/', 'Home'],
    ['/about/', 'About'],
    ['https://discord.com/invite/jPeeZewWRn', 'Discord']
  ]
</script>

<nav class='navbar navbar-expand docs-navbar sticky-top'>
  <div class='container-fluid'>
    <a href={`${base}/`} class='navbar-brand'>
      <img src={`${base}/favicon.png`} alt='logo' />
      SeaDex
    </a>

    <ul class='navbar-nav me-auto'>
      {#each links as [path, label]}
        {@const active = $page.url.pathname === path}
        <li class='nav-item' class:active>
          <a href={`${base}${path}`} class='nav-link'>{label}</a>
        </li>
      {/each}
    </ul>
    {#if $authModel}
      <div class='navbar-brand me-2'>
        <img src={client.files.getUrl($authModel, $authModel.avatar)} alt='profile pic' />
      </div>
      <div class='font-size-14 me-4 text-info-emphasis'>
        {$authModel.username}
      </div>
      <button class='btn btn-secondary' on:pointerdown={logout}>
        Sign Out
      </button>
    {:else}
      {#await authMethods then methods}
        {#each methods.authProviders as p}
          <button class='btn btn-primary text-capitalize ms-3' on:pointerdown={() => providerLogin(p, coll)}>
            Sign-In With {p.name}
          </button>
        {/each}
      {:catch}
        <!-- pocketbase not working -->
      {/await}
    {/if}
  </div>
</nav>

<style>
  .navbar-brand img {
    width: 24px;
    height: 24px;
  }
</style>
