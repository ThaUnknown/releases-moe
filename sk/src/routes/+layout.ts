// turn off SSR - we're JAMstack here
export const ssr = false
// Prerendering turned off. Turn it on if you know what you're doing.
export const prerender = false
// trailing slashes make relative paths much easier
export const trailingSlash = 'always'

export const load = async ({ fetch }) => {
  const res = await fetch('/api/listIDs')
  const text = await res.text()

  return { ids: text.split(',').map(Number) }
  // const response = await fetch('/_/')
  // if (response.redirected) {
  //   alerts.add({
  //     message:
  //       'Please visit <a href="/_/">/_</a> to finalize installation of PocketBase',
  //     type: 'error',
  //     html: true
  //   })
  // }
}
