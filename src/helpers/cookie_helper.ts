import { getCookie, setCookie } from 'typescript-cookie'

const walletCookieName = "ABSTRACT_WALLET_LOADED_ADDRESSES"

export function getWalletAddresses() : string[] {
    const cookie = getCookie(walletCookieName)
    if (!cookie) {
        return []
    }
    console.log(cookie)
    return JSON.parse(cookie!!) as string[]
}

export function setWalletAddresses(addresses: string[]) {
    let value = JSON.stringify(addresses)
    setCookie(walletCookieName, value)
}