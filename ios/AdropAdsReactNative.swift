import AdropAds

@objc(AdropAds)
class AdropAds: NSObject {

  @objc(multiply:withB:withResolver:withRejecter:)
  func multiply(a: Float, b: Float, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
    resolve(a*b)
  }

    @objc(initialize:withResolver:withRejecter:)
    func initialize(_ production: Bool, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
        Adrop.initialize(production: production)
    }
}
