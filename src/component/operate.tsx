import { useDisconnect } from '@reown/appkit/react'; // Import the useDisconnect hook from AppKit
import { useAppKitAccount } from "@reown/appkit/react";
export function OperateButtonList(){
    const { disconnect } = useDisconnect(); // AppKit hook to disconnect
    const handleDisconnect = async () => {
        try {
            await disconnect();
        } catch (error) {
            console.error('Error disconnecting:', error);
        }
    }

    const { isConnected } = useAppKitAccount();

    if (!isConnected) return (<div></div>)

    return(
        <div style={{ margin: '10px 0px', backgroundColor: 'transparent', textAlign: 'left'}}>
            <button onClick={handleDisconnect}>Disconnect</button>
        </div>
    )
}