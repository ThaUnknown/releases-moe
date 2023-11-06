// ==UserScript==
// @name        AB - Mark Seadex Releases
// @description Tags the best releases on AnimeBytes according to https://releases.moe/
// @namespace   ThaUnknown
// @match       *://animebytes.tv/*
// @version     1.0.0
// @author      ThaUnknown
// @icon        http://animebytes.tv/favicon.ico
// @downloadURL https://beta.releases.moe/animebytesmark.user.js
// @connect     releases.moe
// @license     MIT
// ==/UserScript==

/* global $ */

const TORRENT_ID_REGEX = /&torrentid=(\d+)/i

const seadexEndpoint = tinyRest('https://beta.releases.moe/api/collections/entries/records')

// import tinyRest from 'tiny-rest'
function tinyRest (url, options = {}) {
  const baseURL = new URL(url)

  return (path = './', data = {}) => {
    const requestURL = new URL(path, baseURL)

    for (const [key, value] of Object.entries(data)) requestURL.searchParams.append(key, value)

    requestURL.searchParams.sort() // sort to always have the same order, nicer for caching
    return fetch(requestURL, options)
  }
}

async function fetchSeadex (ids) {
  const query = ids.map(({ torrentId }) => {
    return 'trs.url?~\'%torrentid=' + torrentId + '%\''
  }).join('||')
  const res = await seadexEndpoint('https://beta.releases.moe', { filter: `(trs.url?~'%animebytes%' && (${query}))`, expand: 'trs', fields: '*,expand.trs.url', skipTotal: true })
  const { items } = await res.json()
  const linkMap = {}
  for (const { alID, notes, comparison, expand } of items) {
    for (const { url } of expand.trs) {
      const torrentId = url.match(TORRENT_ID_REGEX)?.[1]
      if (torrentId) {
        linkMap[torrentId] = {
          alID, notes, comparison: comparison.split(',')
        }
      }
    }
  }
  return linkMap
}

// Thanks to https://github.com/momentary0/AB-Userscripts/blob/master/torrent-highlighter/src/tfm_torrent_highlighter.user.js#L470
// for the handy selectors
function torrentsOnPage () {
  const torrentPageTorrents = [...document.querySelectorAll(
    '.group_torrent>td>a[href*="&torrentid="]'
  )].map(a => ({
    a,
    torrentId: a.href.match(TORRENT_ID_REGEX)[1],
    seperator: a.href.includes('torrents.php') ? ' | ' : ' / '
  }))
  const searchResultTorrents = [...document.querySelectorAll(
    '.torrent_properties>a[href*="&torrentid="]'
  )].map(a => ({
    a,
    torrentId: a.href.match(TORRENT_ID_REGEX)[1],
    seperator: ' | '
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
  if (e) e = e.substr(1).split('/')
  if (e[1] === tabId) switchTabs(a)
}

(async function () {
  try {
    const torrents = torrentsOnPage()
    const linkMap = await fetchSeadex(torrents)

    for (const torrentLink of torrents) {
      const entry = linkMap[torrentLink.torrentId]
      if (!entry) continue

      // Insert tag
      torrentLink.a.append(torrentLink.seperator)
      let parent = torrentLink.a
      if (torrentLink.a.classList.contains('userscript-highlight')) {
        // highlight already ran
        parent = document.createElement('span')
        parent.className = 'userscript-highlight torrent-field'
        parent.dataset.seadex = 'Seadex'
        parent.dataset.field = 'Seadex'
        torrentLink.a.append(parent)
      }

      const img = document.createElement('img')
      img.src = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAAJACQDASIAAhEBAxEB/8QAGAAAAwEBAAAAAAAAAAAAAAAAAAYHCAX/xAAlEAABBAEEAgEFAAAAAAAAAAABAgMEBQYABxESCBNBFSEyQmH/xAAVAQEBAAAAAAAAAAAAAAAAAAAEBf/EACURAAECBQQBBQAAAAAAAAAAAAIBAwARITFBBAVhkSNxobHB0f/aAAwDAQACEQMRAD8Am1TtX47zaWgfl4lhcJhYpjLdkPxy893fiokDu3YqUnsFurPaMnqgKB6KAOuDiG3Pj1Y485ZUFBh1zYO/U1x4V1OTHLK0yK9PpeV7WUqKA5NKFJUEqTx9kkFpGEdGoSbM6iL5yvz+/cQ02h1JzfK889Xn7pGw4GB7ByJDq4dfjUoIu5DePCTZKZTayAwSuLLPQFqMl3gJd6tdgfxbClGJJtttuNoMmk21/n+4LdA1jUyTLuaZtk9pMMLSlpuC4CfYS4ShXISQFJ4HyYro0sNA42JIjq1zlO53+a8QwdE4IkKOlWVcp3NK+l+KQ4br5tUZ/mcm+x/FIOO1aWmocKBFRx0jsoCGy4f2c6gcn+AfHOjSfo09sBaBAGyQ1tsWgQBslI//2Q=='
      img.title = 'This release is seadex approved!' + (entry.notes ? ` Seadex Notes:\n${entry.notes}` : '')
      img.alt = 'Seadex Choice!'
      img.dataset.seadex = ''
      img.onclick = e => {
        e.preventDefault()
        e.stopImmediatePropagation()
        window.open(`https://beta.releases.moe/${entry.alID}`, '_blank').focus()
      }

      // seadex tab
      const tab = $('<div></div>')
      tab.append(`<div style="margin-bottom: 16px;"><h2><a target="_blank" href="https://beta.releases.moe/${entry.alID}">Releases.moe Entry</a></h2><span>Click to open the entry on the website</span></div>`)

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

      insertTorrentTab(torrentLink.torrentId, 'Seadex', 'seadex', tab)
    }
  } catch (err) {
    console.error(`Failed to fetch seadex for best releases - ${err?.message || err}`)
  }
})()
