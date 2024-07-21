<script lang='ts'>
  import { beforeNavigate, onNavigate } from '$app/navigation'
  import type { FadeParams, TransitionConfig } from 'svelte/transition'

  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  let animate = false
  let load: Promise<unknown> | null = null

  onNavigate(async navigation => {
    await load
    if (navigation.willUnload) await navigation.complete
    load = null
  })
  beforeNavigate(() => {
    load = wait(1000)
  })

  function swipeout (node : Element, opts?: FadeParams): TransitionConfig {
    return {
      delay: 0,
      duration: opts?.duration || 1000,
      tick () {
        if (!animate) {
          animate = true
          node.classList.add('animate')
        }
      }
    }
  }
  function swipein (node : Element, opts?: FadeParams): TransitionConfig {
    return {
      delay: 0,
      duration: opts?.duration || 1000,
      tick () {
        if (animate) {
          animate = false
          node.classList.remove('animate')
        }
      }
    }
  }
</script>

{#if load}
  <div class='h-screen con font-bold overflow-hidden absolute' in:swipein out:swipeout>
    <div class='h-screen text flex items-center justify-center text-nowrap capitalize' data-nosnippet>
      Loading...
    </div>
  </div>
{/if}

<style>
  @keyframes transition-in {
    0% {
      background-position: top right;
      width: 0;
    }
    5% {
      background-position: top right
    }
    100% {
      background-position: top left;
      width: 100vw;
    }
  }
  @keyframes transition-out {
    0% {
      background-position: top left;
      width: 100vw;
    }
    95% {
      background-position: top right
    }
    100% {
      background-position: top right;
      width: 0;
    }
  }
  .con {
    animation: 1s transition-in ease forwards;
    z-index: 90;
    background-position: top left;
    width: 100vw;
  }
  :global(.animate) {
    animation: 1s transition-out ease forwards !important;
  }
  .text {
    font-size: clamp(0px, 10rem, 15vw);
    color: transparent;
    font-family: Verdana, sans-serif;
    width: 100vw;
    background: linear-gradient(90deg, hsl(var(--foreground)) 50%, hsl(var(--background)) 0), linear-gradient(90deg, hsl(var(--background)) 50%, hsl(var(--foreground)) 0);
    background-repeat: no-repeat;
    background-size: 200% 100%;
    background-position: inherit;
    -webkit-background-clip: text, padding-box;
    background-clip: text, padding-box;
  }
</style>
