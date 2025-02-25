// ==UserScript==
// @name        NyaaBlue
// @description Tags the best releases on Nyaa according to https://releases.moe/
// @namespace   ThaUnknown
// @match       https://nyaa.si/*
// @version     1.2.1
// @author      ThaUnknown
// @icon        https://nyaa.si/static/favicon.png
// @downloadURL https://releases.moe/nyaablue.user.js
// @connect     releases.moe
// @license     MIT
// ==/UserScript==

/* get best from seadex api, use api/search for the nyaa search value */

const seadexEndpoint = tinyRest('https://releases.moe/api/collections/torrents/records')
const seadexEntryEndpoint = tinyRest('https://releases.moe/api/collections/entries/records')

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

  const collectionResponse = await seadexEntryEndpoint('', {
    filter: 'trs.infoHash?="' + infoHash + '"',
    expand: 'trs',
    skipTotal: true
  })

  const { items } = await collectionResponse.json()
  if (items?.length) {
    element?.classList.add(items[0].expand.trs.find((info) => info.infoHash === infoHash)?.isBest ? 'panel-best' : 'panel-best-alt')

    const report = document.querySelector('body > div > div:nth-child(1) > div.panel-footer.clearfix')

    document.head.insertAdjacentHTML('beforeend', '<style id="css_blue" type="text/css">button.btn-seadex {margin-right: 5px; color: #fff; background-color: #247fcc; border-color: #247fcc;} button.btn-seadex:hover {margin-right: 5px; color: #fff; background-color: #19578b; border-color: #19578b;} </style>')

    for (const info of items) {
      const button = document.createElement('button')
      button.classList.add('btn', 'btn-xs', 'btn-seadex', 'pull-right')
      button.textContent = 'SeaDex'
      button.onclick = (e) => {
        e.preventDefault()
        e.stopImmediatePropagation()
        window.open(`https://releases.moe/${info.alID}`, '_blank')?.focus()
      }
      report?.insertAdjacentHTML('beforeend', button)
    }
  }
}

async function setSearchBlue () {
  const infoHashList = getInfoHashItemList()

  const torrentsResponse = await seadexEndpoint('', { filter: infoHashList.map(({ infoHash }) => 'infoHash="' + infoHash + '"').join('||'), skipTotal: true, perPage: 75 })

  const { items } = await torrentsResponse.json()

  /** @type {any[]} */
  const bestReleases = items.filter(({ isBest }) => isBest).map(({ infoHash }) => infoHash)
  const altReleases = items.filter(({ isBest }) => !isBest).map(({ infoHash }) => infoHash)

  for (const { element, infoHash } of infoHashList) {
    if (bestReleases.includes(infoHash)) element.classList.add('best')
    if (altReleases.includes(infoHash)) element.classList.add('best-alt')
  }
}

function getViewHash () {
  return document.querySelector('kbd')?.textContent || ''
}

function getInfoHashItemList () {
  return [...document.querySelectorAll('tbody tr')].map(element => {
    const link = /** @type {HTMLLinkElement} */(element.querySelector('td:nth-child(3) a[href*="magnet:\\?xt=urn:btih:"]'))
    const infoHash = link.href.match('magnet:\\?xt=urn:btih:([^&]*)&')?.[1] || ''
    return { element, infoHash }
  })
}

// Apply CSS for "best" and "best alt" table rows. "Best" is blue, "best alt" is orange.
document.head.insertAdjacentHTML('beforeend', '<style id="css_blue" type="text/css">.best > td {background-color: rgba(0, 172, 255, 0.12) !important;} .best:hover > td {background-color: rgba(0, 172, 255, 0.18) !important;} .panel-best, .panel-best > .panel-heading {border-color: rgba(0, 172, 255, 0.12) !important;} .panel-best > .panel-heading {background-color: rgba(0, 172, 255, 0.12) !important;} .panel-success.panel-best > .panel-heading {color: unset;}</style>')
document.head.insertAdjacentHTML('beforeend', '<style id="css_orange" type="text/css">.best-alt > td {background-color: rgba(255, 172, 0, 0.12) !important;} .best-alt:hover > td {background-color: rgba(255, 172, 0, 0.18) !important;} .panel-best-alt, .panel-best-alt > .panel-heading {border-color: rgba(255, 172, 0, 0.12) !important;} .panel-best-alt > .panel-heading {background-color: rgba(255, 172, 0, 0.12) !important;} .panel-success.panel-best-alt > .panel-heading {color: unset;}</style>')

if (window.location.href.match('view')) {
  setViewBlue()
} else {
  setSearchBlue()
}
