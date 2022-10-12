import type { ConfigEnv, Plugin } from 'vite'
import { loadEnv } from 'vite'
import type { ProxyList } from './types'
import { generateWebConfig } from './generate'
import { createProxy, getParsedProxyConfig } from './proxy'

export interface Options {
  /**
   * Proxy list, config this will override the .env proxy configuration
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

  function getProxyList(mode = 'development') {
    if (proxy.length) return proxy
    return getParsedProxyConfig(loadEnv(mode, process.cwd()))
  }

  let env: ConfigEnv

  return {
    name: 'vite-plugin-web-config',
    config(_, _env) {
      env = _env
      const ProxyList = getProxyList(env.mode)
      if (ProxyList.length > 0) {
        return {
          server: {
            proxy: createProxy(ProxyList),
          },
        }
      }
    },
    buildEnd() {
      if (output === false || env.command === 'serve') return

      const ProxyList = getProxyList(env.mode)
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
