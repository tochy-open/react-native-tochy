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
class AdropBannerViewWrapper: UIView, AdropBannerDelegate {
    var bridge: RCTBridge
    
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
    
    @objc
    func setConfig(_ config: NSDictionary) {
        if let unitId = config["unitId"], let width = config["width"], let height = config["height"] {
            let banner = AdropBanner(unitId: unitId as! String)
            banner.delegate = self
            banner.frame = CGRect(x:0, y:0, width:width as! Int, height: height as! Int)
            self.addSubview(banner)
            banner.load()
        }
    }
    
    
    private func sendEvent(_ viewTag: Int, method: String, value: String?) {
        let channel = AdropChannel.methodBannerChannelOf(id: viewTag)
        bridge.eventDispatcher().sendAppEvent(withName: channel, body: [
            "method": method,
            "message": value
        ])
    }
}
