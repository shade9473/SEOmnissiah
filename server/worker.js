import { createRequestHandler } from '@remix-run/cloudflare'
import * as build from './server.js'

addEventListener('fetch', (event) => {
  const handler = createRequestHandler(build, process.env)
  event.respondWith(handler(event.request))
})
