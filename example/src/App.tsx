import * as React from 'react';

import { StyleSheet, View, Button, Platform, Dimensions } from 'react-native';
import { initialize, AdropBanner, AdropBannerController } from 'adrop-ads-react-native';
import { useEffect, useMemo, useState } from 'react';


export default function App() {
  const [bannerController, setBannerController] = useState<AdropBannerController>();
  const [bannerController1, setBanner1Controller] = useState<AdropBannerController>();
  useEffect(() => {
    initialize(false);
  }, []);

  const unitId = useMemo(() => {
    switch (Platform.OS) {
      case 'android':
        return '01HD5R49SJGY7KKEP9MK8DYEN7';
      case 'ios':
        return '01HD5R54R6TDK91Y78M0J0SVCV';
      default:
        return '';
    }
  }, [Platform.OS]);

  const onAdBannerCreated = (controller?: AdropBannerController) => {
    setBannerController(controller);
  };

  const onAdBanner1Created = (controller?: AdropBannerController) => {
    setBanner1Controller(controller);
  };

  const load = () => {
    bannerController?.load();
  };

  const load1 = () => {
    bannerController1?.load();
  };

  const onAdClicked = () => {
    console.log('banner clicked');
  };

  const onAdReceived = () => {
    console.log('banner received');
  };

  const onAdFailedToReceive = () => {
    console.log('banner onAdFailedToReceive');
  };

  return (
    <View style={styles.container}>
      <Button title={'Request Ad!'}
              onPress={load} />
      <View style={{ width: '100%', height: 50, backgroundColor: 'green' }}>
      <AdropBanner unitId={unitId}
                     style={{ width: Dimensions.get('window').width, height: 80 }}
                     onCreated={onAdBannerCreated}
                     onAdClicked={onAdClicked}
                     onAdReceived={onAdReceived}
                     onAdFailedToReceive={onAdFailedToReceive}
        />
      </View>


        <Button title={'Request test Ad!'}
              onPress={load1} />
      <View style={{ width: '100%', height: 50, backgroundColor: 'green' }} onTouchStart={() => console.log("click")}>
      <AdropBanner unitId={'ADROP_PUBLIC_TEST_UNIT_ID'}
                     style={{ width: Dimensions.get('window').width, height: 80 }}
                     onCreated={onAdBanner1Created}
                     onAdClicked={onAdClicked}
                     onAdReceived={onAdReceived}
                     onAdFailedToReceive={onAdFailedToReceive}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
