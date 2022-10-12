/**
 * Used to parse the .env.development proxy configuration
 */
import type { ProxyList, ProxyTargetList } from './types'

const httpsRE = /^https:\/\//

/**
 * Generate proxy
 * @param list
 */
export function createProxy(list: ProxyList = []) {
  const ret: ProxyTargetList = {}
  list.forEach(([prefix, target]) => {
    const isHttps = httpsRE.test(target)
    if (!prefix.startsWith('/')) prefix = `/${prefix}`

    // https://github.com/http-party/node-http-proxy#options
    ret[prefix] = {
      target,
      changeOrigin: true,
      ws: true,
      rewrite: path => path.replace(new RegExp(`^${prefix}`), ''),
      // https is require secure=false
      ...(isHttps ? { secure: false } : {}),
    }
  })
  return ret
}

export function getParsedProxyConfig(env: Record<string, string>): ProxyList {
  const proxyConfig = env.VITE_PROXY
  if (proxyConfig) {
    try {
      const config = JSON.parse(proxyConfig)
      if (Array.isArray(config)) return config
      return []
      // eslint-disable-next-line @typescript-eslint/brace-style
    } catch (e) {
      console.error('VITE_PROXY parse failed, ignored.')
    }
  }
  return []
}
