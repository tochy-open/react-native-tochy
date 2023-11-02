//
//  AdropBannerViewWrapper.swift
//  adrop-ads-react-native
//
//  Created by 민우임 on 11/1/23.
//
import UIKit
import React
import AdropAds

@objc
class AdropBannerViewWrapper: RCTView, AdropBannerDelegate {
    var bridge: RCTBridge
    var banner: AdropBanner?
    
    func onAdReceived(_ banner: AdropBanner) {
        sendEvent(method: AdropMethod.DID_RECEIVE_AD, value: nil)
    }
    
    func onAdClicked(_ banner: AdropBanner) {
        sendEvent(method: AdropMethod.DID_CLICK_AD, value: nil)
    }
    
    func onAdFailedToReceive(_ banner: AdropBanner, _ error: AdropErrorCode) {
        sendEvent(method: AdropMethod.DID_FAIL_TO_RECEIVE_AD, value: error.rawValue)
    }
    
    init (bridge: RCTBridge) {
        self.bridge = bridge
        super.init(frame: .zero)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    override func layoutSubviews() {
        super.layoutSubviews()
        self.banner?.frame = frame
    }
    
    @objc
    func setUnitId(_ unitId: NSString) {
        banner = AdropBanner(unitId: unitId as String)
        banner?.delegate = self
        self.addSubview(banner!)
        
        if let eventEmitter = bridge.module(for: BannerEventEmitter.self) as? BannerEventEmitter {
            eventEmitter.sendEvent(withName: AdropChannel.METHOD_BANNER_CHANNEL,
                                   body: ["method": AdropMethod.DID_CREATED_BANNER, "tag": self.reactTag])
        }
    }
    
    func load() {
        self.banner?.load()
    }
    
    private func sendEvent(method: String, value: String?) {
        let channel = AdropChannel.methodBannerChannelOf(id: self.reactTag as! Int)
        if let eventEmitter = bridge.module(for: BannerEventEmitter.self) as? BannerEventEmitter {
            eventEmitter.sendEvent(withName: AdropChannel.METHOD_BANNER_CHANNEL,
                                   body: [ "method": method, "channel": channel, "message": value ?? "" ])
        }
    }
}


@objc(BannerEventEmitter)
class BannerEventEmitter: RCTEventEmitter {
    override class func requiresMainQueueSetup() -> Bool {
        return true
    }
    override func supportedEvents() -> [String]! {
        return [AdropChannel.METHOD_BANNER_CHANNEL, AdropMethod.DID_CLICK_AD, AdropMethod.DID_FAIL_TO_RECEIVE_AD, AdropMethod.DID_RECEIVE_AD]
    }
    
}
