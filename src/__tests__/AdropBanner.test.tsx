import AdropBannerController from '../banner/AdropBannerController'
import { render } from '@testing-library/react-native'
import AdropBanner from '../banner/AdropBanner'
import React from 'react'
import { DeviceEventEmitter } from 'react-native'
import { AdropChannel } from '../bridge/AdropChannel'


jest.mock('react-native', () => {
    const RN = jest.requireActual('react-native')
    RN.NativeModules.AdropAds = {
        initialize: jest.fn(),
    }

    // mock modules created through UIManager
    RN.UIManager.getViewManagerConfig = (name: string) => {
        if (name === 'AdropAds') {
            return { initialize: jest.fn() }
        }
        return {}
    }
    return RN
})

describe('AdropBanner Test', () => {
    const unitId = 'ADROP_PUBLIC_TEST_UNIT_ID'

    const onAdReceived = (callback: () => void) => {
        console.log('onAdReceived')
        callback()
    }

    const onAdFailedReceive = (callback: () => void) => {
        console.log('onAdFailedReceive')
        callback()
    }

    const onAdClicked = (callback: () => void) => {
        console.log('onAdClicked')
        callback()
    }

    const onCreated = (controller?: AdropBannerController) => {
        console.log('onCreated')
        controller?.load()
    }

    test('onCreated', () => {
        const createdSpy = jest.spyOn(console, 'log')

        render(<AdropBanner
            style={{ width: 100, height: 100 }}
            unitId={unitId}
            onCreated={onCreated}
            onAdReceived={() => onAdReceived(() => {
            })}
            onAdClicked={() => onAdClicked(() => {
            })}
            onAdFailedToReceive={() => onAdFailedReceive(() => {
            })} />)

        expect(createdSpy).toHaveBeenCalledWith('onCreated');

        const viewTag = 123
        const listener = jest.fn()
        const subscription = DeviceEventEmitter.addListener(AdropChannel.methodBannerChannel, listener)
        DeviceEventEmitter.emit(AdropChannel.methodBannerChannel, viewTag)

        expect(listener).toHaveBeenCalledWith(viewTag)
        subscription.remove()
    })
})
