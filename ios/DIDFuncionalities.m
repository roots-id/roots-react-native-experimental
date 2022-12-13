#import "React/RCTBridgeModule.h"
#import "DIDFunctionalities.h"
@interface RCT_EXTERN_MODULE(DIDFuncionalities, NSObject)
RCT_EXTERN_METHOD(addEvent:(NSString *)name location:(NSString *)location date:(nonnull NSNumber *)date);
//  RCT_EXTERN_METHOD(simpleMethodReturns:
//    (RCTResponseSenderBlock) callback
//  )
//  RCT_EXTERN_METHOD(simpleMethodWithParams:
//    (NSString *) param
//    callback: (RCTResponseSenderBlock)callback
//  )
//  RCT_EXTERN_METHOD(
//    createPrismDID: (RCTPromiseResolveBlock) resolve
//    rejecter: (RCTPromiseRejectBlock) reject
//  )
//  RCT_EXTERN_METHOD(rejectPromise:
//    (RCTPromiseResolveBlock) resolve
//    rejecter: (RCTPromiseRejectBlock) reject
//  )
RCT_EXTERN_METHOD(
    createPrismDID: (RCTPromiseResolveBlock) resolve
    rejecter: (RCTPromiseRejectBlock) reject
  )
RCT_EXTERN_METHOD(
    createPeerDID:(NSString *)updatemediator
    resolve:(RCTPromiseResolveBlock)resolve
    rejecter:(RCTPromiseRejectBlock)reject
  )

RCT_EXTERN_METHOD(
  resolveDID:(NSString *)did
  resolve:(RCTPromiseResolveBlock)resolve
  rejecter:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
  StartPrismAgent:(NSString *)mediatorDid
  resolve:(RCTPromiseResolveBlock)resolve
  rejecter:(RCTPromiseRejectBlock)reject
)
@end
