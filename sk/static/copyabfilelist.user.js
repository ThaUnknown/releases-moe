// ==UserScript==
// @name        Copy Filelist
// @namespace   Violentmonkey Scripts
// @match       https://animebytes.tv/torrents.php*
// @grant       none
// @version     1.0
// @author      ThaUnknown
// @description copy filelist
// ==/UserScript==
async function getFromAPI (page = 1) {
  const groupId = /** @type HTMLInputElement */(document.querySelector('input[name="thread"]')).value
  const torrentKeyElement = /** @type HTMLLinkElement */(document.querySelector("head > link[href*='rss_torrents_all']")).href.split('/')
  const torrentKey = torrentKeyElement[torrentKeyElement.length - 1]
  const username = /** @type HTMLLinkElement */(document.querySelector('a.username')).innerText
  const animeId = /** @type HTMLLinkElement */(document.querySelector('a[href*="/series.php?id="]')).href.split('=')[1]
  const apiUrl = `https://animebytes.tv/scrape.php?torrent_pass=${torrentKey}&username=${username}&hentai=0&type=anime&tags=abg-${groupId}&page=${page}&anime=${animeId}`
  const group = (await (await fetch(apiUrl)).json()).Groups.find(({ ID }) => ID == groupId)
  // cope harder lol
  if (!group) return getFromAPI(page + 1)
  return group
}

/**
 * @param {string} tid
 */
async function copyFilelist (tid) {
  try {
    const data = await getFromAPI()
    const { FileList } = data.Torrents.find(({ ID }) => ID == tid)
    const files = FileList.map(({ filename, size }) => ({ filename, size }))
    navigator.clipboard.writeText(JSON.stringify(files))
  } catch (e) {
    alert(e.message)
  }
}

function spawnButtons () {
  document.querySelectorAll('ul[id*="tabs_"]').forEach(e => {
    const tid = e.id.split('_')[1]
    const child = document.createElement('li')
    const btn = document.createElement('a')
    btn.innerText = 'Copy Filelist'
    btn.href = '#'
    btn.onclick = () => copyFilelist(tid)
    child.appendChild(btn)
    e.appendChild(child)
  })
}
spawnButtons()
