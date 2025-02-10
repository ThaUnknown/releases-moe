// ==UserScript==
// @name        AB - Mark SeaDex Releases
// @description Tags the best releases on AnimeBytes according to https://releases.moe/
// @namespace   ThaUnknown
// @match       *://animebytes.tv/*
// @version     1.2.0
// @author      ThaUnknown
// @grant       GM_xmlhttpRequest
// @icon        http://animebytes.tv/favicon.ico
// @downloadURL https://releases.moe/animebytesmark.user.js
// @connect     releases.moe
// @license     MIT
// @run-at      document-idle
// ==/UserScript==

/* global $ */

const TORRENT_ID_REGEX = /&torrentid=(\d+)/i

const seadexEndpoint = tinyRest('https://releases.moe/api/collections/entries/records')

function gmFetchJson (url, opts = {}, timeout = 10000) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: 'GET',
      timeout,
      ...opts,
      url: url.toString(),
      ontimeout: function () {
        reject(new Error(`Request timed out after ${timeout}ms`))
      },
      onerror: function (err) {
        reject(err || new Error('Failed to fetch'))
      },
      onload: function (response) {
        resolve(JSON.parse(response.responseText))
      }
    })
  })
}

// import tinyRest from 'tiny-rest'
// modified for userscripts
function tinyRest (url, options = {}) {
  const baseURL = new URL(url)

  return (path = './', data = {}) => {
    const requestURL = new URL(path, baseURL)

    for (const [key, value] of Object.entries(data)) requestURL.searchParams.append(key, value)

    requestURL.searchParams.sort() // sort to always have the same order, nicer for caching
    return gmFetchJson(requestURL, options)
  }
}

async function fetchSeadex (ids) {
  const query = ids.map(({ torrentId }) => {
    return 'trs.url?~\'%torrentid=' + torrentId + '%\''
  }).join('||')
  const { items } = await seadexEndpoint('', { filter: `(trs.tracker='PT' && (${query}))`, expand: 'trs', fields: '*,expand.trs.url,expand.trs.isBest', skipTotal: true })
  const linkMap = {}
  for (const { alID, notes, comparison, expand } of items) {
    for (const { url, isBest } of expand.trs) {
      const torrentId = url.match(TORRENT_ID_REGEX)?.[1]
      if (torrentId) linkMap[torrentId] = { alID, notes, isBest, comparison: comparison.split(',') }
    }
  }
  return linkMap
}

// Thanks to https://github.com/momentary0/AB-Userscripts/blob/master/torrent-highlighter/src/tfm_torrent_highlighter.user.js#L470
// for the handy selectors
function torrentsOnPage () {
  const torrentPageTorrents = /** @type {Array<{a: HTMLAnchorElement, torrentId: string, separator: string}>} */([...document.querySelectorAll(
    (window.location.href.includes('torrents.php') ? '' : '#anime_table ') + '.group_torrent'
  )].map(elm => {
    /** @type {NodeListOf<HTMLAnchorElement>} */
    const links = elm.querySelectorAll('a[href*="&torrentid="]')
    if (links.length === 0) return null
    const a = links[links.length - 1]
    return {
      a,
      torrentId: a.href.match(TORRENT_ID_REGEX)?.[1],
      separator: a.href.includes('torrents.php') && links.length === 1 ? ' | ' : ' / '
    }
  }).filter((value) => value))
  const searchResultTorrents = /** @type {Array<HTMLAnchorElement>} */([...document.querySelectorAll(
    '.torrent_properties>a[href*="&torrentid="]'
  )]).map(a => ({
    a,
    torrentId: a.href.match(TORRENT_ID_REGEX)?.[1],
    separator: ' | '
  }))
  return [...torrentPageTorrents, ...searchResultTorrents]
}

function insertTorrentTab (torrentId, tabName, tabId, content) {
  // Select
  const select = $(`<li><a href="#${torrentId}/${tabId}">${tabName}</a></li>`)
  const a = select.find('a')
  a.click(() => switchTabs(a))
  $(`#tabs_${torrentId}`).append(select)

  // Tab it self
  const container = $(`<div id="${torrentId}_${tabId}" style="display: none;"></div>`)
  container.append(content)
  $(`#tabs_${torrentId}`).parent().append(container)

  // Load from url hash on page load
  let e = window.location.hash
  if (e) e = e.substring(1).split('/')
  if (e[1] === tabId) switchTabs(a)
}

(async function () {
  try {
    const torrents = torrentsOnPage()
    // Do a 100 torrents at a time to make url length manageable
    for (let i = 0; i < torrents.length; i += 100) {
      const sliced = torrents.slice(i, i + 100)
      const linkMap = await fetchSeadex(sliced)

      for (const torrentLink of sliced) {
        const entry = linkMap[torrentLink.torrentId]
        if (!entry) continue

        // Insert tag
        torrentLink.a.append(torrentLink.separator)
        let parent = torrentLink.a
        if (torrentLink.a.classList.contains('userscript-highlight')) {
          // highlight already ran
          parent = document.createElement('span')
          parent.className = 'userscript-highlight torrent-field'
          parent.dataset.seadex = 'SeaDex'
          parent.dataset.field = 'SeaDex'
          torrentLink.a.append(parent)
        }

        const img = document.createElement('img')
        img.src = entry.isBest
          ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAJCAYAAABXLP43AAAAAXNSR0IArs4c6QAAAMJJREFUOE9jZBgkgFE1TWwaAwNDJhb3TCdOnHE+K8u/vN9/GLug6qffnvUqC8lcMB+bf5HVgBzyP6skH0PdtJ6JDMSIg9QxMDDOZ2D4nwhSD+EzgD0B49+e9YoR3QKYI2Bq4A6BGoCiHslgnOIINaiOQXMUSD8o1FFCC1kN0SGCy6ewEMUmj2QxONTxqcGaRmCaqB0iWMyFpx+iQwQWN+hph9g0gp4mYKEFM5fiXPP/z//5bBwMROUafDkJIzUPVLECALBqyRj71YzpAAAAAElFTkSuQmCC'
          : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAJCAYAAABXLP43AAAAAXNSR0IArs4c6QAAALJJREFUOE/NlMEOgkAMRN961Z/kqAfOfoLxA+S4n+lJMd1QUmohTTRRbi2zs9NhSuFPntLBDTgGeoZM/wl1D/0drhN+qHAyvK2O5rUYETKeA9QFyPQFJ2J20AleaqANoXWF4q9QEYqZhUwEC7whXu0rxotxouS8uL5wy2LSjqxNqo5G783FzfUtTJgRPfRtRwLeOT9pR/Tb+OxkM+IzoW4p78db84B6SG7N1ia9pflXv5UXtZlmWNmuM34AAAAASUVORK5CYII='
        img.title = entry.notes ? `SeaDex Notes:\n${entry.notes}` : ''
        img.alt = 'SeaDex Choice!'
        img.dataset.seadex = ''
        img.onclick = e => {
          e.preventDefault()
          e.stopImmediatePropagation()
          window.open(`https://releases.moe/${entry.alID}`, '_blank')?.focus()
        }
        parent.append(img)

        // seadex tab
        const tab = $('<div></div>')
        tab.append(`<div style="margin-bottom: 16px;"><h2><a target="_blank" href="https://releases.moe/${entry.alID}">Releases.moe Entry</a></h2><span>Click to open the entry on the website</span></div>`)

        if (entry.notes) {
          const span = $('<span style="white-space: pre-wrap;"></span>')
          span.text(entry.notes)
          const div = $('<div style="margin-bottom: 16px;"></div>')
          div.append('<h2>Notes</h2>', span)
          tab.append(div)
        }

        if (Array.isArray(entry.comparisons) && entry.comparisons?.length > 0) {
          const div = $('<div style="margin-bottom: 16px;"></div>')
          div.append('<h2>Comparisons</h2>')
          for (const link of entry.comparisons) {
            div.append(`<a target="_blank" href="${link}">${link}</a>`, '<br>')
          }
          tab.append(div)
        }

        insertTorrentTab(torrentLink.torrentId, 'SeaDex', 'seadex', tab)
      }
    }
  } catch (err) {
    console.error(`Failed to fetch seadex for best releases - ${err?.message || err}`)
  }
})()
