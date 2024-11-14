import { randomID } from '@/lib/utils'
import { useClerk } from '@clerk/nextjs'
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt'

export function getUrlParams(
    url = window.location.href
) {
    const urlStr = url.split('?')[1];
    return new URLSearchParams(urlStr);
}

export default function VideoUiKit() {
    const roomID = getUrlParams().get('roomID') || randomID(5);
    const { user } = useClerk()

    const myMeeting = async (element: HTMLDivElement) => {
        // generate Kit Token
        // const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID, randomID(5), randomID(5));

        const initMeeting = async () => {

            const res = await fetch(`api/zegocloud?userID=${user?.id}`)
            const { token, appID } = await res.json()
            const username = user?.fullName || user?.emailAddresses[0].emailAddress.split('@')[0]

            const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(appID, token, roomID, user?.id!, username)

            // Create instance object from Kit Token.
            const zp = ZegoUIKitPrebuilt.create(kitToken);
            // start the call
            zp.joinRoom({
                container: element,
                sharedLinks: [
                    {
                        name: 'Personal link',
                        url:
                            window.location.protocol + '//' +
                            window.location.host + window.location.pathname +
                            '?roomID=' +
                            roomID,
                    },
                ],
                scenario: {
                    mode: ZegoUIKitPrebuilt.GroupCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
                },
            });
        }

        initMeeting()

    };

    return (
        <div
            className="myCallContainer"
            ref={myMeeting}
            style={{ width: '100vw', height: '100vh' }}
        ></div>
    );
}
