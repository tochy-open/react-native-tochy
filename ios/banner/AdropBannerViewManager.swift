import React
import AdropAds
import UIKit


@objc(AdropBannerViewManager)
class AdropBannerViewManager: RCTViewManager {
    @objc override static func moduleName() -> String {
        return "AdropBannerView"
    }
    
    @objc func load(_ reactTag: NSNumber, eventValue value: String) {
        print("Received load with value: \(value)")
    }
    
    override static func requiresMainQueueSetup() -> Bool {
        print("!!requiresMainQueueSetup")
        return true
    }
    
    override func view() -> UIView! {
        let wrapper = AdropBannerViewWrapper(bridge: self.bridge)
        return wrapper
    }
    
    @objc func load(_ reactTag: NSNumber) {
          print("Received 'load' event")
    }
}
