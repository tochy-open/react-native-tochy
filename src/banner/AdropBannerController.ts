import {
    DeviceEventEmitter,
    type EmitterSubscription, NativeEventEmitter, NativeModules, Platform,
    UIManager,
} from 'react-native';
import { AdropChannel } from '../bridge/AdropChannel';
import { AdropMethod } from '../bridge/AdropMethod';


class AdropBannerController {
    protected tag: number = 0;
    private listener?: EmitterSubscription | any;

    private readonly channel;
    private readonly _onAdReceived: () => void;
    private readonly _onAdFailedReceive: (error?: any) => void;
    private readonly _onAdClicked: () => void;

    constructor(
        tag: number,
        onAdReceived: () => void,
        onAdFailedReceive: (error?: any) => void,
        onAdClicked: () => void,
    ) {
        this.tag = tag;
        this.channel = AdropChannel.methodBannerChannelOf(tag);
        this._onAdReceived = onAdReceived;
        this._onAdFailedReceive = onAdFailedReceive;
        this._onAdClicked = onAdClicked;

        this.listener = Platform.OS === 'android' ? DeviceEventEmitter.addListener(
            this.channel,
            (event) => {
                switch (event.method) {
                    case AdropMethod.didReceiveAd:
                        this._onAdReceived();
                        break;
                    case AdropMethod.didFailToReceiveAd:
                        this._onAdFailedReceive(event.message);
                        break;
                    case AdropMethod.didClickAd:
                        this._onAdClicked();
                        break;
                }
            },
        ) : new NativeEventEmitter(NativeModules.BannerEventEmitter).addListener(
            AdropChannel.methodBannerChannel,
            (event) => {
                if (event.channel !== this.channel) return;
                switch (event.method) {
                    case AdropMethod.didReceiveAd:
                        this._onAdReceived();
                        break;
                    case AdropMethod.didFailToReceiveAd:
                        this._onAdFailedReceive(event.message);
                        break;
                    case AdropMethod.didClickAd:
                        this._onAdClicked();
                        break;
                }
            },
        );

        return this;
    }

    public load() {
        UIManager.dispatchViewManagerCommand(this.tag, 'load', []);
    }

    destroy() {
        this.listener?.remove();
    }
}

export default AdropBannerController;
