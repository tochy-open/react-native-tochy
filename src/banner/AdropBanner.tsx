import React, { useEffect, useRef } from 'react';
import {
  DeviceEventEmitter, findNodeHandle,
  requireNativeComponent,
} from 'react-native';
import AdropBannerController from './AdropBannerController';
import { AdropChannel } from '../bridge/AdropChannel';


type AdropBannerNativeProp = {
  style: { height: number, width: any },
  unitId: string,
}

type AdropBannerProp = AdropBannerNativeProp & {
  onCreated: (controller?: AdropBannerController) => void,
  onAdReceived: () => void
  onAdClicked: () => void
  onAdFailedToReceive: (error?: any) => void
};

const ComponentName = 'AdropBannerView';

const BannerView = requireNativeComponent<AdropBannerNativeProp>(ComponentName);

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
      console.log(`eventListener:: id:${id} , viewId: ${viewId}`)
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
      style={style}
      unitId={unitId}
    />
  );

};
export default AdropBanner;
