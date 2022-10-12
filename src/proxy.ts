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
  for (const [prefix, target] of list) {
    const isHttps = httpsRE.test(target)

    // https://github.com/http-party/node-http-proxy#options
    ret[prefix] = {
      target,
      changeOrigin: true,
      ws: true,
      rewrite: path => path.replace(new RegExp(`^${prefix}`), ''),
      // https is require secure=false
      ...(isHttps ? { secure: false } : {}),
    }
  }
  return ret
}

export function getParsedProxyConfig(env: Record<string, string>): ProxyList {
  const proxyConfig = env.VITE_PROXY
  if (proxyConfig) {
    try {
      return JSON.parse(proxyConfig)
      // eslint-disable-next-line @typescript-eslint/brace-style
    } catch (e) {
      console.error('VITE_PROXY parse failed, ignored.')
    }
  }
  return []
}
