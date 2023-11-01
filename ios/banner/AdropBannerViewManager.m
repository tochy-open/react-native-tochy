#import <React/RCTViewManager.h>
 
@interface RCT_EXTERN_MODULE(AdropBannerViewManager, RCTViewManager)
RCT_EXTERN_METHOD(load:(nonnull NSNumber *)reactTag)
RCT_EXPORT_VIEW_PROPERTY(config, NSDictionary)

@end
