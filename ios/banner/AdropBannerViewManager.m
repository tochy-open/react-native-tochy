#import <React/RCTViewManager.h>
 
@interface RCT_EXTERN_MODULE(AdropBannerViewManager, RCTViewManager)


RCT_EXPORT_VIEW_PROPERTY(config, NSDictionary)
RCT_EXPORT_METHOD(load:(NSNumber *)reactTag){}

@end

