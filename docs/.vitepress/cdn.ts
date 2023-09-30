// this file makes the cdn link configurable, then we can disable or switch it easily

// default disabled when developing
var enabled: boolean = process.env.NODE_ENV !== "development"

export function isCDNEnabled(): bool {
  return enabled
}

export function enableCDN(): void {
  enabled = true
}

export function disableCDN(): void {
  enabled = false
}

export const CDN_PREFIX = "https://cdn.crashmc.com/"

export function useCDN(url: string): string {
  if (!url.startsWith("https://")) {
    // DO NOT allow http here
    throw "URL must starts with https"
  }
  return enabled ? CDN_PREFIX + url : url
}
