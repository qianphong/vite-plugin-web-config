import type { Plugin } from 'vite'
import { loadEnv } from 'vite'
import { generateWebConfig } from './generate'
import { createProxy, getParsedProxyConfig } from './proxy'
import type { ProxyList } from './types'

export interface Options {
  /**
   * Proxy list
   * @default []
   */
  proxy?: ProxyList

  /**
   * Output path
   * @default 'web.config'
   */
  output?: string | false
}

export default function WebConfig(options: Options = {}): Plugin {
  const { proxy = [], output = 'web.config' } = options

  function getProxyList() {
    if (proxy.length) return proxy
    return getParsedProxyConfig(loadEnv('development', process.cwd()))
  }

  return {
    name: 'vite-plugin-web-config',
    enforce: 'post',
    config() {
      const ProxyList = getProxyList()

      if (ProxyList.length > 0) {
        return {
          server: {
            proxy: createProxy(ProxyList),
          },
        }
      }
    },
    buildEnd() {
      if (output === false) return

      const ProxyList = getProxyList()
      const webConfig = generateWebConfig(ProxyList)
      if (webConfig) {
        this.emitFile({
          type: 'asset',
          fileName: output,
          source: webConfig,
        })
      }
    },
  }
}
