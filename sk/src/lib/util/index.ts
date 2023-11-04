import _as, { type AnitomyResult } from 'anitomyscript'

const formatter = new Intl.RelativeTimeFormat('en')
const ranges = {
  years: 3600 * 24 * 365,
  months: 3600 * 24 * 30,
  weeks: 3600 * 24 * 7,
  days: 3600 * 24,
  hours: 3600,
  minutes: 60,
  seconds: 1
}

export function since (date: Date) {
  const secondsElapsed = (date.getTime() - Date.now()) / 1000
  for (const [key, value] of Object.entries(ranges)) {
    if (value < Math.abs(secondsElapsed)) {
      const delta = secondsElapsed / value
      return formatter.format(Math.round(delta), key as any)
    }
  }
}

const units = [' B', ' kB', ' MB', ' GB', ' TB']
export function fastPrettyBytes (num: number) {
  if (isNaN(num)) return '0 B'
  if (num < 1) return num + ' B'
  const exponent = Math.min(Math.floor(Math.log(num) / Math.log(1000)), units.length - 1)
  return Number((num / Math.pow(1000, exponent)).toFixed(2)) + units[exponent]
}

const termMapping:Record<any, {text: string, color: string}> = {}
termMapping['5.1'] = { text: '5.1', color: '#f67255' }
termMapping['5.1CH'] = termMapping[5.1]
termMapping['TRUEHD5.1'] = { text: 'TrueHD 5.1', color: '#f67255' }
termMapping.AAC = { text: 'AAC', color: '#f67255' }
termMapping.AACX2 = termMapping.AAC
termMapping.AACX3 = termMapping.AAC
termMapping.AACX4 = termMapping.AAC
termMapping.AC3 = { text: 'AC3', color: '#f67255' }
termMapping.EAC3 = { text: 'EAC3', color: '#f67255' }
termMapping['E-AC-3'] = termMapping.EAC3
termMapping.FLAC = { text: 'FLAC', color: '#f67255' }
termMapping.FLACX2 = termMapping.FLAC
termMapping.FLACX3 = termMapping.FLAC
termMapping.FLACX4 = termMapping.FLAC
termMapping.VORBIS = { text: 'Vorbis', color: '#f67255' }
termMapping.DUALAUDIO = { text: 'Dual Audio', color: '#f67255' }
termMapping['DUAL AUDIO'] = termMapping.DUALAUDIO
termMapping['10BIT'] = { text: '10 Bit', color: '#0c8ce9' }
termMapping['10BITS'] = termMapping['10BIT']
termMapping['10-BIT'] = termMapping['10BIT']
termMapping['10-BITS'] = termMapping['10BIT']
termMapping.HI10 = termMapping['10BIT']
termMapping.HI10P = termMapping['10BIT']
termMapping.HI444 = { text: 'HI444', color: '#0c8ce9' }
termMapping.HI444P = termMapping.HI444
termMapping.HI444PP = termMapping.HI444
termMapping.HEVC = { text: 'HEVC', color: '#0c8ce9' }
termMapping.H265 = termMapping.HEVC
termMapping['H.265'] = termMapping.HEVC
termMapping.X265 = termMapping.HEVC
termMapping.AV1 = { text: 'AV1', color: '#0c8ce9' }

export function sanitiseTerms ({ video_term: videoTerm, audio_term: audioTerm, video_resolution: resolution }: AnitomyResult) {
  const video = !Array.isArray(videoTerm) ? [videoTerm] : videoTerm
  const audio = !Array.isArray(audioTerm) ? [audioTerm] : audioTerm

  const terms = [...new Set([...video, ...audio].map(term => termMapping[term?.toUpperCase()]).filter(t => t))]
  if (resolution) terms.unshift({ text: resolution, color: '#c6ec58' })

  return terms
}

// normalizes anitomyscript for TS typings
export async function anitomyscript (input: string) {
  const res = await _as(input)
  if (Array.isArray(res)) return res[0]
  return res
}
export async function anitomyscriptarray (input: string[]) {
  const res = await _as(input)
  if (!Array.isArray(res)) return [res]
  return res
}

export function debounce (fn: (...args: any[]) => any, time: number) {
  let timeout: any
  return (...args: any[]) => {
    const later = () => {
      timeout = null
      fn(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, time)
  }
};

export const VIDEO_EXTENSIONS = ['3g2', '3gp', 'asf', 'avi', 'dv', 'flv', 'gxf', 'm2ts', 'm4a', 'm4b', 'm4p', 'm4r', 'm4v', 'mkv', 'mov', 'mp4', 'mpd', 'mpeg', 'mpg', 'mxf', 'nut', 'ogm', 'ogv', 'swf', 'ts', 'vob', 'webm', 'wmv', 'wtv']
export const VIDEO_RX = new RegExp(`.(${VIDEO_EXTENSIONS.join('|')})$`, 'i')
export const TYPE_EXCLUSIONS = ['ED', 'ENDING', 'NCED', 'NCOP', 'OP', 'OPENING', 'PREVIEW', 'PV']
