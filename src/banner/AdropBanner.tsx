import React, { useEffect, useRef } from 'react';
import {
  DeviceEventEmitter, findNodeHandle,
  requireNativeComponent,
} from 'react-native';
import AdropBannerController from './AdropBannerController';
import { AdropChannel } from '../bridge/AdropChannel';


type AdropBannerNativeProp = {
  style: { height: number, width: number },
  unitId: string,
}

type AdropBannerProp = AdropBannerNativeProp & {
  onCreated: (controller?: AdropBannerController) => void,
  onAdReceived: () => void
  onAdClicked: () => void
  onAdFailedToReceive: (error?: any) => void
};

const ComponentName = 'AdropBannerView';

const BannerView = requireNativeComponent<{ config: { unitId: string, width: number, height: number} }>(ComponentName);

const AdropBanner: React.FC<AdropBannerProp> = (
  {
    unitId,
    onCreated,
    onAdClicked,
    onAdFailedToReceive,
    onAdReceived,
    style
  },
) => {

  const bannerRef = useRef(null);

  useEffect(() => {
    const eventListener = DeviceEventEmitter.addListener(AdropChannel.methodBannerChannel, (id) => {
      let viewId = findNodeHandle(bannerRef.current) ?? 0;
      if (id === viewId) {
        onCreated(new AdropBannerController(viewId, onAdReceived, onAdFailedToReceive, onAdClicked));
      }
    });

    return () => {
      eventListener.remove();
    };
  }, []);

  return (
    <BannerView
      ref={bannerRef}
      config={{unitId, width: style.width, height: style.height }}
    />
  );

};
export default AdropBanner;
