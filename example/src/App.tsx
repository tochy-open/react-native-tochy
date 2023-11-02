import * as React from 'react'

import { StyleSheet, View, Button, Dimensions, Platform } from 'react-native'
import {
    AdropAds,
    AdropBanner,
    AdropBannerController,
} from 'adrop-ads-react-native'
import { useEffect, useMemo, useState } from 'react'


export default function App() {
    const [bannerController, setBannerController] =
        useState<AdropBannerController>()
    const [testBannerController, setTestBannerController] =
        useState<AdropBannerController>()
    useEffect(() => {
        AdropAds.initialize(false)
    }, [])

    const unitId = useMemo(() => {
        switch (Platform.OS) {
            case 'android':
                return '01HD5R49SJGY7KKEP9MK8DYEN7'
            case 'ios':
                return '01HD5R54R6TDK91Y78M0J0SVCV'
            default:
                return ''
        }
    }, [Platform.OS])

    const onAdBannerCreated = (controller?: AdropBannerController) => {
        setBannerController(controller)
    }

    const onAdTestBannerCreated = (controller?: AdropBannerController) => {
        setTestBannerController(controller)
    }

    const loadBanner = () => {
        bannerController?.load()
    }

    const loadTestBanner = () => {
        testBannerController?.load()
    }

    const onAdClicked = () => {
        console.log('banner clicked')
    }

    const onAdReceived = () => {
        console.log('banner received')
    }

    const onAdFailedToReceive = () => {
        console.log('banner onAdFailedToReceive')
    }

    return (
        <View style={styles.container}>
            <View>
                <Button title={'Request Ad!'} onPress={loadBanner} />
                <Button title={'Request TEST Ad!'} onPress={loadTestBanner} />
            </View>

            <View>
                <View style={{ width: '100%', height: 50 }}>
                    <AdropBanner
                        unitId={unitId}
                        style={{
                            width: Dimensions.get('window').width,
                            height: 80,
                        }}
                        onCreated={onAdBannerCreated}
                        onAdClicked={onAdClicked}
                        onAdReceived={onAdReceived}
                        onAdFailedToReceive={onAdFailedToReceive}
                    />

                </View>

                <View style={{ width: '100%', height: 50 }}>
                    <AdropBanner
                        unitId={'ADROP_PUBLIC_TEST_UNIT_ID'}
                        style={{
                            width: Dimensions.get('window').width,
                            height: 80,
                        }}
                        onCreated={onAdTestBannerCreated}
                        onAdClicked={onAdClicked}
                        onAdReceived={onAdReceived}
                        onAdFailedToReceive={onAdFailedToReceive}
                    />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 50,
    },
    box: {
        width: 60,
        height: 60,
        marginVertical: 20,
    },
})
