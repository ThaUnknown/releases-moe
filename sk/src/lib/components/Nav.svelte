<script lang='ts' context='module'>
  import { base } from '$app/paths'
  import { page } from '$app/stores'
  import { authModel, client, providerLogin, logout } from '../pocketbase/index.js'
  import { toast } from 'svelte-sonner'
  import Sun from 'svelte-radix/Sun.svelte'
  import Moon from 'svelte-radix/Moon.svelte'
  import { toggleMode, ModeWatcher } from 'mode-watcher'
  import SearchModal from './SearchModal.svelte'
  import { Button } from '$lib/components/ui/button'

  import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
  import * as Avatar from '$lib/components/ui/avatar'
  import { LogIn } from 'lucide-svelte'

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
    ['/about/', 'About'],
    ['https://discord.com/invite/jPeeZewWRn', 'Discord'],
    ['https://sheet.releases.moe', 'Sheet']
  ]

</script>

<header class='sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
  <div class='container flex h-14 max-w-screen-2xl items-center'>
    <div class='mr-4 flex'>
      <a href={`${base}/`} class='mr-6 hidden sm:flex items-center space-x-2'>
        <img src={`${base}/favicon.png`} alt='logo' class='h-6 w-6' />
        <span class='hidden font-bold sm:inline-block'>SeaDex</span>
      </a>
      <nav class='flex items-center gap-6 text-sm'>
        {#each links as [path, label]}
          {@const active = $page.url.pathname === path}
          <a href={`${base}${path}`} class='transition-colors hover:text-foreground/80 {active ? 'text-foreground' : 'text-foreground/60'}'>{label}</a>
        {/each}
      </nav>
    </div>
    <SearchModal />
    <div class='flex items-center space-x-4 ml-auto sm:ml-0'>
      {#if $authModel}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild let:builder>
            <Button variant='ghost' builders={[builder]} class='relative h-6 w-6 rounded-full p-0'>
              <Avatar.Root class='h-6 w-6'>
                <Avatar.Image src={client.files.getUrl($authModel, $authModel.avatar)} alt={$authModel.username} />
                <Avatar.Fallback>{$authModel.username}</Avatar.Fallback>
              </Avatar.Root>
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content class='w-56' align='end'>
            <DropdownMenu.Label class='font-normal'>
              <div class='flex flex-col space-y-1'>
                <p class='text-sm font-medium leading-none'>{$authModel.username}</p>
                <p class='text-xs leading-none text-muted-foreground'>{$authModel.email}</p>
              </div>
            </DropdownMenu.Label>
            <DropdownMenu.Separator />
            <DropdownMenu.Item on:click={logout}>
              Log out
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      {:else}
        {#await authMethods then methods}
          {#each methods.authProviders as p}
            <Button variant='outline' class='capitalize' on:click={() => providerLogin(p, coll)}>
              <LogIn class='absolute size-4' />
            </Button>
          {/each}
        {:catch}
          <!-- pocketbase not working -->
        {/await}
      {/if}
      <ModeWatcher />
      <Button on:click={toggleMode} variant='outline' size='icon' class='ml-10'>
        <Sun class='size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
        <Moon class='absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
        <span class='sr-only'>Toggle theme</span>
      </Button>
    </div>
  </div>
</header>
