import React
import AdropAds
import UIKit


@objc(AdropBannerViewManager)
class AdropBannerViewManager: RCTViewManager {
    var wrapperView:AdropBannerViewWrapper?
    
    override static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    override func view() -> AdropBannerViewWrapper? {
        wrapperView = AdropBannerViewWrapper(bridge: self.bridge)
//        self.bannerDict[wrapper.reactTag as! Int] = wrapper
        return wrapperView
    }
    
//    @objc func load(_ reactTag: NSNumber) {
//        if self.bridge.uiManager.view(forReactTag: reactTag) is AdropBannerViewWrapper {
//            wrapperView.load()
//    //
//        }
//        wrapperView.load()
//        print("reactTag \(reactTag)")
//        print("wrapperView?.reactTag \(wrapperView?.reactTag)")
        
//        print("bannerDict \(bannerDict)")
//        self.bannerDict[Int(reactTag)]?.load()
     
//        if reactTag == wrapperView?.reactTag {
//            wrapperView?.load()
//        }
    }
}
