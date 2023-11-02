import React, { useCallback, useEffect, useRef } from 'react'
import {
    findNodeHandle,
    requireNativeComponent,
    NativeModules, NativeEventEmitter,
} from 'react-native'
import AdropBannerController from './AdropBannerController'
import { AdropChannel } from '../bridge/AdropChannel'
import { AdropMethod } from '../bridge/AdropMethod'


type AdropBannerNativeProp = {
    style: { height: number; width: number | string }
    unitId: string
}

type AdropBannerProp = AdropBannerNativeProp & {
    onCreated: (controller?: AdropBannerController) => void
    onAdReceived: () => void
    onAdClicked: () => void
    onAdFailedToReceive: (error?: any) => void
}

const ComponentName = 'AdropBannerView'

const BannerView = requireNativeComponent<AdropBannerNativeProp>(ComponentName)

const AdropBanner: React.FC<AdropBannerProp> = ({
    unitId,
    onCreated,
    onAdClicked,
    onAdFailedToReceive,
    onAdReceived,
    style,
}) => {
    const bannerRef = useRef(null)

    const validateView = useCallback((viewTag: number) => viewTag === findNodeHandle(bannerRef.current) ?? 0, [])
    const bannerChannel = useCallback(() => AdropChannel.methodBannerChannelOf(findNodeHandle(bannerRef.current) ?? 0), [])

    const handleCreated = useCallback((viewTag: number) => {
        if (!validateView(viewTag)) return
        onCreated(new AdropBannerController(viewTag))
    }, [onCreated, validateView])

    const handleAdClicked = useCallback((event: any) => {
        if (event.channel !== bannerChannel()) return
        onAdClicked()
    }, [bannerChannel, onAdClicked])

    const handleAdReceived = useCallback((event: any) => {
        if (event.channel !== bannerChannel()) return
        onAdReceived()
    }, [bannerChannel, onAdReceived])

    const handleAdFailedReceive = useCallback((event: any) => {
        if (event.channel !== bannerChannel()) return
        onAdFailedToReceive(event.message)
    }, [bannerChannel, onAdFailedToReceive])

    useEffect(() => {

        const eventListener = new NativeEventEmitter(NativeModules.BannerEventEmitter).addListener(
            AdropChannel.methodBannerChannel, (event: any) => {
                switch (event.method) {
                    case AdropMethod.didCreatedBanner:
                        handleCreated(event.tag)
                        break
                    case AdropMethod.didClickAd:
                        handleAdClicked(event)
                        break
                    case AdropMethod.didReceiveAd:
                        handleAdReceived(event)
                        break
                    case AdropMethod.didFailToReceiveAd:
                        handleAdFailedReceive(event)
                        break
                }
            },
        )

        return () => {
            eventListener.remove()
        }
    }, [handleCreated, handleAdClicked, handleAdReceived, handleAdFailedReceive])

    return <BannerView ref={bannerRef} style={style} unitId={unitId} />
}
export default AdropBanner
