interface Props {
    wallets: Wallet[]
}

export function WalletList(props: Props) {

    function displayWallets() {
        if (props.wallets && props.wallets.length > 0) {
            return (
                <>
                <div className="wallet_list_item list_header">
                    <span>Name</span>
                    <span>Wallet Address</span>
                    <span>Eth Balance</span>
                    <span>DGN Balance</span>
                </div>
                { props.wallets.map(
                    (wallet) => {
                        return (
                            <div className="wallet_list_item" key={wallet.name}>
                                <span>{wallet.name}</span>
                                <span>{wallet.address}</span>
                                <span>{wallet.ethBalance}</span>
                                <span>{wallet.degenBalance}</span>
                            </div>
                        )
                    }
                )}
                </>
            )
        } else {
            return (
                <h3>No wallets created yet</h3>
            )
        }
    }

    return (
        <div className="panel wallet_list">
            <h3>All Wallets</h3>
            {displayWallets()}
        </div>
    );
}