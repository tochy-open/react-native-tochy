import * as React from 'react';

import { StyleSheet, View, Button, Dimensions } from 'react-native';
import { AdropAds, AdropBanner, AdropBannerController } from 'adrop-ads-react-native';
import { useEffect, useState } from 'react';


export default function App() {
  const [bannerController, setBannerController] = useState<AdropBannerController>();
  useEffect(() => {
    AdropAds.initialize(false);
  }, []);

  const onAdBannerCreated = (controller?: AdropBannerController) => {
    setBannerController(controller);
  };

  const load = () => {
    bannerController?.load();
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
      <View style={{ width: '100%', height: 50 }}>
        <AdropBanner unitId={'ADROP_PUBLIC_TEST_UNIT_ID'}
                     style={{ width: Dimensions.get('window').width, height: 80 }}
                     onCreated={onAdBannerCreated}
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
    justifyContent: 'space-between',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
