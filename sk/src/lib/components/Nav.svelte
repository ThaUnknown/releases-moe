<script lang='ts' context='module'>
  import { base } from '$app/paths'
  import { page } from '$app/stores'
  import { authModel, client, providerLogin, logout } from '../pocketbase/index.js'
  import { toast } from 'svelte-sonner'

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

<nav class='navbar'>
  <!-- Navbar content (with toggle sidebar button) -->

  <!-- Navbar brand -->
  <a href={`${base}/`} class='navbar-brand'>
    <img src={`${base}/favicon.png`} alt='logo' />
    SeaDex
  </a>

  <ul class='navbar-nav d-flex mr-auto'>
    {#each links as [path, label]}
      {@const active = $page.url.pathname === path}
      <li class='nav-item' class:active>
        <a href={`${base}${path}`} class='nav-link'>{label}</a>
      </li>
    {/each}
  </ul>
  {#if $authModel}
    <div class='navbar-brand'>
      <img src={client.files.getUrl($authModel, $authModel.avatar)} alt='profile pic' />
    </div>
    <div class='font-size-14 mr-10 text-light'>
      {$authModel.username}
    </div>
    <button class='btn text-capitalize' on:pointerdown={logout}>
      Sign Out
    </button>
  {:else}
    {#await authMethods then methods}
      {#each methods.authProviders as p}
        <button class='btn btn-primary text-capitalize ml-5' on:pointerdown={() => providerLogin(p, coll)}>
          Sign-In With {p.name}
        </button>
      {/each}
    {:catch}
      <!-- pocketbase not working -->
    {/await}
  {/if}

</nav>
