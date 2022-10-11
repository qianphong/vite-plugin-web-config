import type { Plugin } from 'vite'
import { loadEnv } from 'vite'
import { generateWebConfig } from './generate'
import { createProxy, getParsedProxyConfig } from './proxy'

export default function WebConfig(): Plugin {
  return {
    name: 'vite-plugin-web-config',
    enforce: 'post',
    config() {
      const ProxyList = getParsedProxyConfig(
        loadEnv('development', process.cwd()),
      )
      if (ProxyList.length > 0) {
        return {
          server: {
            proxy: createProxy(ProxyList),
          },
        }
      }
    },
    buildEnd() {
      const ProxyList = getParsedProxyConfig(
        loadEnv('production', process.cwd()),
      )
      const webConfig = generateWebConfig(ProxyList)
      if (webConfig) {
        this.emitFile({
          type: 'asset',
          fileName: 'web.config',
          source: webConfig,
        })
      }
    },
  }
}
