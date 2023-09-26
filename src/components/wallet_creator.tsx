import { useState } from "react";
import { deployWallet } from "../helpers/ethers_helper";
import { getWalletAddresses, setWalletAddresses } from "../helpers/cookie_helper";

interface Props {
    refreshWalletInfo: () => void
}

export function WalletCreator(props: Props) {

    const [walletName, setWalletName] = useState('');
    const [password, setPassword] = useState('');
    const [preloadEth, setPreloadEth] = useState(0);
    const [preloadDgn, setPreloadDgn] = useState(0);

    async function createWallet() {
        if (walletName != '' && password != '')  {
            let abstractWallet = await deployWallet(walletName, password, preloadEth, preloadDgn)
            if (abstractWallet != undefined) {
                let addresses = getWalletAddresses()
                addresses.push(await abstractWallet.getAddress())
                setWalletAddresses(addresses);

                props.refreshWalletInfo()
            }
            setWalletName('')
            setPassword('')
            setPreloadEth(0)
            setPreloadDgn(0)
        }
    }

    function renderStateHtml() {
        return (
            <>
            <input
                placeholder="Main Wallet"
                value={walletName}
                onChange={(e) => {setWalletName(e.currentTarget.value)}} />
            <input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => {setPassword(e.currentTarget.value)}} />
            <input
                placeholder="Preload ETH"
                pattern="[0-9]*"
                value={preloadEth}
                onChange={(e) => {setPreloadEth(e.target.validity.valid && e.target.value != '' ? parseInt(e.target.value) : preloadEth)}} />
            <input
                placeholder="Preload DGN"
                pattern="[0-9]*"
                value={preloadDgn}
                onChange={(e) => {setPreloadDgn(e.target.validity.valid && e.target.value != '' ? parseInt(e.target.value) : preloadDgn)}} />
            <button onClick={createWallet}>
                Create
            </button>
            </>
        )
    }

    
    return (
        <div className="panel wallet_creator">
            <h3>Create Wallet</h3>
            {renderStateHtml()}
        </div>
    );
}