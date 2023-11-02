import React, { useEffect, useRef } from 'react';
import {
    DeviceEventEmitter,
    findNodeHandle,
    requireNativeComponent,
    NativeModules, NativeEventEmitter, Platform,
} from 'react-native';
import AdropBannerController from './AdropBannerController';
import { AdropChannel } from '../bridge/AdropChannel';


type AdropBannerNativeProp = {
    style: { height: number; width: number | string };
    unitId: string;
};

type AdropBannerProp = AdropBannerNativeProp & {
    onCreated: (controller?: AdropBannerController) => void;
    onAdReceived: () => void;
    onAdClicked: () => void;
    onAdFailedToReceive: (error?: any) => void;
};

const ComponentName = 'AdropBannerView';

const BannerView = requireNativeComponent<AdropBannerNativeProp>(ComponentName);

const AdropBanner: React.FC<AdropBannerProp> = ({
    unitId,
    onCreated,
    onAdClicked,
    onAdFailedToReceive,
    onAdReceived,
    style,
}) => {
    const bannerRef = useRef(null);

    useEffect(() => {
        const eventListener = Platform.OS === 'android' ? DeviceEventEmitter.addListener(
            AdropChannel.methodBannerChannel,
            (id: number) => {
                if (id === findNodeHandle(bannerRef.current) ?? 0) {
                    onCreated(
                        new AdropBannerController(
                            id,
                            onAdReceived,
                            onAdFailedToReceive,
                            onAdClicked,
                        ),
                    );
                }
            },
        ) : new NativeEventEmitter(NativeModules.BannerEventEmitter).addListener(
            AdropChannel.methodBannerChannel, (id: any) => {
                if (id === findNodeHandle(bannerRef.current) ?? 0) {
                    onCreated(
                        new AdropBannerController(
                            id,
                            onAdReceived,
                            onAdFailedToReceive,
                            onAdClicked,
                        ),
                    );
                }
            },
        );

        return () => {
            eventListener.remove();
        };
    }, []);

    useEffect(() => {
        const nativeEventEmitter = new NativeEventEmitter(NativeModules.BannerEventEmitter).addListener(
            AdropChannel.methodBannerChannel, (id: any) => {
                if (id === findNodeHandle(bannerRef.current) ?? 0) {
                    onCreated(
                        new AdropBannerController(
                            id,
                            onAdReceived,
                            onAdFailedToReceive,
                            onAdClicked,
                        ),
                    );
                }
            },
        );
        return () => {
            nativeEventEmitter.remove();
        };
    }, []);

    return <BannerView ref={bannerRef} style={style} unitId={unitId} />;
};
export default AdropBanner;
