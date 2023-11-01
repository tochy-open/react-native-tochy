import React
import AdropAds
import UIKit


@objc(AdropBannerViewManager)
class AdropBannerViewManager: RCTViewManager {
    static let REACT_CLASS = "AdropBannerView"
    var wrapperView: AdropBannerViewWrapper?

    override static func moduleName() -> String {
      return REACT_CLASS
    }
    
    override static func requiresMainQueueSetup() -> Bool {
        print("!!requiresMainQueueSetup")
        return true
    }
    
    override func view() -> UIView! {
        wrapperView = AdropBannerViewWrapper(bridge: self.bridge)
        return wrapperView
    }
    
    @objc func load(_ reactTag: NSNumber) {
        wrapperView?.load()
    }
        
    @objc func receiveCommand(_ reactTag: NSNumber, commandName: String, params: [Any]?) {
      if commandName == "customCommand" {
        // 처리할 코드를 여기에 작성
        print("Received custom command with parameters: \(params ?? [])")
      }
    }
}
