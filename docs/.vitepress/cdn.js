
// this file makes the cdn link configurable, then we can disable or switch it easily

var enabled = true

export function isCDNEnabled(){
	return enabled
}

export function enableCDN(){
	enabled = true
}

export function disableCDN(){
	enabled = false
}

export const CDN_PREFIX = "https://cdn.crashmc.com/"

export function useCDN(url){
	if(!url.startsWith('https://')){ // DO NOT allow http here
		throw 'URL must starts with https'
	}
	return enabled ?CDN_PREFIX + url :url
}
