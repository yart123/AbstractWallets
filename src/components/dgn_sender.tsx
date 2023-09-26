import { useState } from "react";
import { sendDgnFromAbstract } from "../helpers/ethers_helper";

interface Props {
    refreshWalletInfo: () => void
}

export function DgnSender(props: Props) {

    const [walletAddress, setWalletAddress] = useState('');
    const [toAddress, setToAddress] = useState('');
    const [password, setPassword] = useState('');
    const [amount, setAmount] = useState(0);

    async function createWallet() {
        if (walletAddress != '' && toAddress != '' && password != '')  {
            await sendDgnFromAbstract(walletAddress, toAddress, password, amount)
            props.refreshWalletInfo()
            setWalletAddress('')
            setToAddress('')
            setPassword('')
            setAmount(0)
        }
    }

    function renderStateHtml() {
        return (
            <>
            <input
                placeholder="Wallet Address"
                value={walletAddress}
                onChange={(e) => {setWalletAddress(e.currentTarget.value)}} />
            <input
                placeholder="Target Address"
                value={toAddress}
                onChange={(e) => {setToAddress(e.currentTarget.value)}} />
            <input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => {setPassword(e.currentTarget.value)}} />
            <input
                placeholder="Amount"
                pattern="[0-9]*"
                value={amount}
                onChange={(e) => {setAmount(e.target.validity.valid && e.target.value != '' ? parseInt(e.target.value) : amount)}} />
            <button onClick={createWallet}>
                Send
            </button>
            </>
        )
    }

    
    return (
        <div className="panel wallet_creator">
            <h3>Send DGN</h3>
            {renderStateHtml()}
        </div>
    );
}