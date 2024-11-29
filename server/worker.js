import express from 'express'
import { createMiddleware } from '@hono/express'
import { Hono } from 'hono'

const app = new Hono()
const expressApp = express()

// Import your existing Express routes and middleware
import './server.js'

// Convert Express app to Hono middleware
app.use('*', createMiddleware(expressApp))

// Export for Cloudflare Workers
export default {
  fetch: app.fetch,
  async scheduled(event, env, ctx) {
    // Handle any scheduled tasks here
    ctx.waitUntil(Promise.resolve())
  }
}
