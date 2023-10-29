// ==UserScript==
// @name        nyaablue
// @namespace   seadex scripts
// @match       https://nyaa.si/*
// @grant       GM.xmlHttpRequest
// @version     1.0.0
// @author      ThaUnknown
// @description brings blue to nyaav2 with seadex api
// @downloadURL https://beta.releases.moe/nyaablue.user.js
// @connect     releases.moe
// @license     MIT
// ==/UserScript==

/* get best from seadex api, use api/search for the nyaa search value */

const seadexEndpoint = tinyRest('https://beta.releases.moe/api/collections/torrents/records')

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

async function setViewBlue () {
  const infoHash = getViewHash()
  const element = document.querySelector('.container .panel')

  const torrentsResponse = await seadexEndpoint('', {
    filter: 'infoHash="' + infoHash + '"'
  })

  const { items } = await torrentsResponse.json()
  if (items[0]?.infoHash) {
    element?.classList.add('panel-info')
  }
}

async function setSearchBlue () {
  const infoHashList = getInfoHashItemList()

  const torrentsResponse = await seadexEndpoint('', {
    filter: infoHashList.map(({ infoHash }) => 'infoHash="' + infoHash + '"').join('||')
  })

  const { items } = await torrentsResponse.json()

  /** @type {any[]} */
  const bestReleases = items.map(({ infoHash }) => infoHash)

  for (const { element, infoHash } of infoHashList) {
    if (bestReleases.includes(infoHash)) element.classList.add('info')
  }
}

function getViewHash () {
  return document.querySelector('kbd')?.textContent || ''
}

function getInfoHashItemList () {
  return [...document.querySelectorAll('tbody tr')].map(element => {
    const link = /** @type {HTMLLinkElement} */(element.querySelector('td:nth-child(3) a:nth-child(2)'))
    const infoHash = link.href.match('magnet:\\?xt=urn:btih:([^&]*)&')?.[1] || ''
    return { element, infoHash }
  })
}

// dark theme "support" (thanks olli)
document.head.insertAdjacentHTML('beforeend', '<style id="css_blue" type="text/css">body.dark .torrent-list > tbody > tr.info > td {color: inherit; background-color: rgba(0, 172, 255, 0.12);} body.dark .torrent-list > tbody > tr.info:hover > td {background-color: rgba(0, 172, 255, 0.18);} body.dark div.panel-info, body.dark div.panel-info > .panel-heading {border-color: #2c414b;} body.dark div.panel-info > .panel-heading {background-color: #2a3f4a;}</style>')

if (window.location.href.match('view')) {
  setViewBlue()
} else {
  setSearchBlue()
}
