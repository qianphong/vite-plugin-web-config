import { Builder } from 'xml2js'
import type { ProxyList } from './proxy'

export function generateWebConfig(rules: ProxyList) {
  const config = {
    configuration: {
      'system.webServer': [
        {
          rewrite: [
            {
              rules: [
                {
                  // eslint-disable-next-line arrow-parens
                  rule: rules.map(rule => {
                    const pattern = rule[0]
                    const target = rule[1]
                    const p = `${pattern}/(.*)`
                    return {
                      $: {
                        name: `${pattern}_rule`,
                        stopProcessing: 'true',
                      },
                      match: [{ $: { url: p } }],
                      conditions: [
                        {
                          $: { logicalGrouping: 'MatchAll' },
                          add: [
                            {
                              $: {
                                input: '{REQUEST_URI}',
                                pattern: p,
                              },
                            },
                          ],
                        },
                      ],
                      action: [
                        {
                          $: {
                            type: 'Rewrite',
                            url: `${target}/{R:1}`,
                            logRewrittenUrl: 'true',
                          },
                        },
                      ],
                    }
                  }),
                },
              ],
            },
          ],
        },
      ],
    },
  }
  const builder = new Builder()
  const xml = builder.buildObject(config)
  return xml
}
