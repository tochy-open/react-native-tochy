import AdropBannerController from '../banner/AdropBannerController'
import { Adrop, AdropErrorCode } from '../index'
import { act, fireEvent, render, screen } from '@testing-library/react-native'
import AdropBanner from '../banner/AdropBanner'
import React, { useState } from 'react'
import { Button, DeviceEventEmitter, Text, View } from 'react-native'
import { AdropChannel } from '../bridge/AdropChannel'
import { AdropMethod } from '../bridge/AdropMethod'


const Example: React.FC<{
    unitId: string, onClickLoad: () => void
}> = ({ unitId, onClickLoad }) => {
    const [controller, setController] = useState<AdropBannerController>()
    const [text, setText] = useState('')

    const handleCreated = (_controller?: AdropBannerController) => {
        act(() => {
            setController(_controller)
            setText('created')
        })
    }

    const handleReceived = () => {
        act(() => {
            setText('received')
        })
    }

    const handleClicked = () => {
        act(() => {
            setText('clicked')
        })
    }

    const handleFailedToReceive = (error: string) => {
        act(() => {
            setText(error)
        })
    }

    const onClickLoadButton = () => {
        onClickLoad()
        controller?.load()
    }

    return (
        <View>
            <Button title={'request ad'} testID='requestAd' onPress={onClickLoadButton} />
            <View testID='bannerWrapper'>
                <AdropBanner style={{ width: 100, height: 80 }}
                             unitId={unitId}
                             onCreated={handleCreated}
                             onAdReceived={handleReceived}
                             onAdClicked={handleClicked}
                             onAdFailedToReceive={handleFailedToReceive} />
            </View>
            <Text testID='status'>{text}</Text>
        </View>
    )
}

jest.mock('react-native', () => {
    const RN = jest.requireActual('react-native')
    RN.NativeModules.AdropAds = {
        initialize: jest.fn(),
    }
    RN.NativeModules.BannerEventEmitter = {
        addListener: jest.fn(),
        removeListeners: jest.fn(),
    }

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
    const invalidId = 'INVALID_TEST_UNIT_ID'
    const onClickMock = jest.fn()
    let tag = 3
    let bannerChannel = AdropChannel.methodBannerChannelOf(tag)

    const checkStatus = (status: string) => {
        const element = screen.getByTestId('status')
        expect(element.props.children).toBe(status)
    }

    beforeAll(() => {
        Adrop.initialize(false)
    })

    afterEach(() => {
        bannerChannel = AdropChannel.methodBannerChannelOf(++tag)
    })

    test('banner created successfully', () => {
        render(<Example unitId={unitId} onClickLoad={onClickMock} />)
        // onAdBannerCreated callback
        DeviceEventEmitter.emit(AdropChannel.methodBannerChannel, { method: AdropMethod.didCreatedBanner, tag })

        checkStatus('created')
    })

    test('load before created banner', () => {
        render(<Example unitId={unitId} onClickLoad={onClickMock} />)

        fireEvent.press(screen.getByTestId('requestAd'))
        expect(onClickMock).toHaveBeenCalled()
        checkStatus('')
    })

    test('banner when app has no campaigns (inactive from remote config) ', () => {
        render(<Example unitId={unitId} onClickLoad={onClickMock} />)
        DeviceEventEmitter.emit(AdropChannel.methodBannerChannel, { method: AdropMethod.didCreatedBanner, tag })

        fireEvent.press(screen.getByTestId('requestAd'))
        expect(onClickMock).toHaveBeenCalled()

        DeviceEventEmitter.emit(AdropChannel.methodBannerChannel, { method: AdropMethod.didFailToReceiveAd, channel: bannerChannel, message: AdropErrorCode.inactive })

        checkStatus(AdropErrorCode.inactive)
    })

    test('banner when app has no campaigns (active from remote config) ', () => {
        render(<Example unitId={unitId} onClickLoad={onClickMock} />)
        DeviceEventEmitter.emit(AdropChannel.methodBannerChannel, { method: AdropMethod.didCreatedBanner, tag })

        fireEvent.press(screen.getByTestId('requestAd'))
        expect(onClickMock).toHaveBeenCalled()

        DeviceEventEmitter.emit(AdropChannel.methodBannerChannel, { method: AdropMethod.didFailToReceiveAd, channel: bannerChannel, message: AdropErrorCode.adNoFill })

        checkStatus(AdropErrorCode.adNoFill)
    })

    test('banner received ad successfully', () => {
        render(<Example unitId={unitId} onClickLoad={onClickMock} />)
        DeviceEventEmitter.emit(AdropChannel.methodBannerChannel, { method: AdropMethod.didCreatedBanner, tag })

        fireEvent.press(screen.getByTestId('requestAd'))
        expect(onClickMock).toHaveBeenCalled()

        DeviceEventEmitter.emit(AdropChannel.methodBannerChannel, { method: AdropMethod.didReceiveAd, channel: bannerChannel })

        checkStatus('received')
    })

    test('banner receive to fail with invalid unitId', () => {
        render(<Example unitId={invalidId} onClickLoad={onClickMock} />)
        DeviceEventEmitter.emit(AdropChannel.methodBannerChannel, { method: AdropMethod.didCreatedBanner, tag })

        fireEvent.press(screen.getByTestId('requestAd'))
        expect(onClickMock).toHaveBeenCalled()

        DeviceEventEmitter.emit(AdropChannel.methodBannerChannel, { method: AdropMethod.didFailToReceiveAd, channel: bannerChannel, message: AdropErrorCode.adNoFill })

        checkStatus(AdropErrorCode.adNoFill)
    })

    test('banner receive to fail with empty unitId', () => {
        render(<Example unitId={''} onClickLoad={onClickMock} />)
        DeviceEventEmitter.emit(AdropChannel.methodBannerChannel, { method: AdropMethod.didCreatedBanner, tag })

        fireEvent.press(screen.getByTestId('requestAd'))
        expect(onClickMock).toHaveBeenCalled()

        DeviceEventEmitter.emit(AdropChannel.methodBannerChannel, { method: AdropMethod.didFailToReceiveAd, channel: bannerChannel, message: AdropErrorCode.inactive })

        checkStatus(AdropErrorCode.inactive)
    })

    test('banner clicked', () => {
        render(<Example unitId={unitId} onClickLoad={onClickMock} />)
        DeviceEventEmitter.emit(AdropChannel.methodBannerChannel, { method: AdropMethod.didCreatedBanner, tag })

        fireEvent.press(screen.getByTestId('requestAd'))
        expect(onClickMock).toHaveBeenCalled()

        DeviceEventEmitter.emit(AdropChannel.methodBannerChannel, { method: AdropMethod.didReceiveAd, channel: bannerChannel })
        checkStatus('received')

        // const bannerView = screen.getByTestId('bannerWrapper').props.children[0]    // press not work
        fireEvent.press(screen.getByTestId('bannerWrapper'))
        DeviceEventEmitter.emit(AdropChannel.methodBannerChannel, { method: AdropMethod.didClickAd, channel: bannerChannel })
        checkStatus('clicked')

        DeviceEventEmitter.emit(AdropChannel.methodBannerChannel, { method: AdropMethod.didReceiveAd, channel: bannerChannel })
        checkStatus('received')
    })
})
