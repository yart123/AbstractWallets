'use client'

import { ExternalProvider } from "@ethersproject/providers";
import { useState } from "react";
import { WalletConnector } from "../src/components/wallet_connector";
import { WalletCreator } from "../src/components/wallet_creator";
import { WalletList } from "../src/components/wallet_list";
import { loadWalletInfo } from "../src/helpers/ethers_helper";
import { EthSender } from "../src/components/eth_sender";
import { DgnSender } from "../src/components/dgn_sender";

export default function IndexPage({
}) {
    const [wallet, setWallet] = useState<ExternalProvider|undefined>(undefined);
    const [account, setAccount] = useState<string|undefined>(undefined);
    const [abstractWallets, setAbstractWallets] = useState<Wallet[]>([]);

    function refreshWalletInfo() {
        loadWalletInfo(setAbstractWallets)
            .catch(console.error)
    }

    if (!abstractWallets || abstractWallets.length == 0) {
        refreshWalletInfo()
    }

    return (  
        <>
            <WalletConnector {...{
                wallet: wallet,
                account: account,
                setWallet: setWallet,
                setAccount: setAccount
            }} />
            <div className="pageContent">
                <WalletList {...{
                    wallets: abstractWallets
                }} />
                <WalletCreator {...{
                    refreshWalletInfo: refreshWalletInfo
                }} />
                <EthSender {...{
                    refreshWalletInfo: refreshWalletInfo
                }} />
                <DgnSender {...{
                    refreshWalletInfo: refreshWalletInfo
                }} />
            </div>
        </>
    )
}