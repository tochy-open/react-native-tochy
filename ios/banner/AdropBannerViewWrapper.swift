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
        print("onAdReceived!")
        sendEvent(banner.tag, method: AdropMethod.DID_RECEIVE_AD, value: nil)
    }
    
    func onAdClicked(_ banner: AdropBanner) {
        print("onAdClicked!")
        sendEvent(banner.tag, method: AdropMethod.DID_CLICK_AD, value: nil)
    }
    
    func onAdFailedToReceive(_ banner: AdropBanner, _ error: AdropErrorCode) {
        print("onAdFailedToReceive!")
        sendEvent(banner.tag, method: AdropMethod.DID_FAIL_TO_RECEIVE_AD, value: error.rawValue)
    }
    
    init (bridge: RCTBridge){
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
        banner = AdropBanner(unitId: unitId as! String)
        banner?.delegate = self
        self.addSubview(banner!)
        
        bridge.eventDispatcher().sendAppEvent(withName: AdropChannel.METHOD_BANNER_CHANNEL, body: [self.reactTag])
    }
    
    
    private func sendEvent(_ viewTag: Int, method: String, value: String?) {
        let channel = AdropChannel.methodBannerChannelOf(id: viewTag)
        bridge.eventDispatcher().sendAppEvent(withName: channel, body: [
            "method": method,
            "message": value
        ])
    }
}
