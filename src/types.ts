import type { ProxyOptions } from 'vite'

export type ProxyItem = [prefix: string, target: string]

export type ProxyList = ProxyItem[]

export type ProxyTargetList = Record<string, ProxyOptions>
