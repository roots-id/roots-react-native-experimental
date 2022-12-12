// DIDFuncionalities.swift
import Builders
import Domain
import Foundation
import PrismAgent

@objc(DIDFuncionalities)
class DIDFuncionalities: NSObject {
  //  private let castor: Castor
  private let castor: Castor
  private let agent: PrismAgent
  @Published var createdDID: DID?
  @Published var resolvedDID: DIDDocument?
  
  @Published var createdDID1: DID?

  override
  init()
  {
    self.castor = CastorBuilder(
      apollo: ApolloBuilder().build()
    ).build()
    self.agent = PrismAgent()
  }

  @objc(addEvent:location:date:)
  func addEvent(_ name: String, location: String, date: NSNumber) -> Void {
    print("DIDFunctionalities - add event",location,date)
  }

  @objc public func createPrismDID(
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) -> Void {
    Task {
      print("DIDFunctionalities - creating prism DID asynchronously", self.createdDID)
      let did = await createPrismDID()
      print("DIDFunctionalities - created prism DID asynchronously", self.createdDID)
      print("DIDFunctionalities - returning prism DID", did)
      resolve(did?.string)
    }
  }

     func createPrismDID() async -> DID? {
       print("DIDFuncionalities - Called create prism DID!")
         // Creates new PRISM DID
         let did = try? await agent.createNewPrismDID(
             // Add this if you want to provide a IndexPath
             // keyPathIndex: <#T##Int?#>
             // Add this if you want to provide an alias for this DID
             // alias: <#T##String?#>
             // Add any services available in the DID
             services: [ .init(
                 id: "DemoID",
                 type: ["DemoType"],
                 serviceEndpoint: .init(uri: "DemoServiceEndpoint")
             )
        ])
   
         await MainActor.run {
           self.createdDID = did
           print("DIDFunctionalities - DID is",createdDID ?? "DID unset")
         }
       return did
    }



  @objc public func createPeerDID(
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) -> Void {
    Task {
      print("DIDFunctionalities - creating peer DID asynchronously", self.createdDID1)
      let did = await createPeerDID()
      print("DIDFunctionalities - created peer DID asynchronously", self.createdDID1)
      print("DIDFunctionalities - returning peer DID", did)
      resolve(did?.string)
    }
  }

     func createPeerDID() async -> DID? {
       print("DIDFuncionalities - Called create peer DID!")
         // Creates new peer DID
         let did = try? await agent.createNewPeerDID(services: [ .init(
          id: "DemoID",
          type: ["DemoType"],
          serviceEndpoint: .init(uri: "alex")
      )
         ], updateMediator: false)
   
         await MainActor.run {
           self.createdDID1 = did
           print("DIDFunctionalities - DID is",createdDID ?? "DID unset")
         }
       return did
    }


@objc public func resolveDID(
    _ did: NSString,
    resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) -> Void {
    Task {
      print("DIDFunctionalities - resolving... DID asynchronously", self.resolvedDID)
      let didDoc = await resolveDID(did: did)
      print("DIDFunctionalities - resolving.. DID asynchronously", self.resolvedDID)
      print("DIDFunctionalities - resolving... DID", didDoc)
      resolve(didDoc)
    }
  }

     func resolveDID(did: NSString) async -> DIDDocument? {
       print("DIDFuncionalities - RESOLVING DID!")
         // Creates new PRISM DID
         let _did = did as String
         print("trying to resolve did ",_did)
         let document = try? await castor.resolveDID(did: DID(string: _did))
   
         await MainActor.run {
           self.resolvedDID = document
           print("DIDFunctionalities - DIDDOCIS is",document ?? "DID unset")
         }
       return document
    }


}
