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
  private let mercury: Mercury
  @Published var createdDID: DID?
  @Published var resolvedDID: DIDDocument?
  
  @Published var createdDID1: DID?
  
  @Published var packedMessage: String?

  override
  init()
  {
    self.castor = CastorBuilder(
      apollo: ApolloBuilder().build()
    ).build()
    self.agent = PrismAgent()
    self.mercury = MercuryBuilder(
      apollo: ApolloBuilder().build(),
      castor:self.castor,
      pluto: PlutoBuilder().build()
    ).build()
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
      let did = await createPrismDID()
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
//           print("DIDFunctionalities - DID is",createdDID ?? "DID unset")
         }
       return did
    }



  @objc public func createPeerDID(
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) -> Void {
    Task {
      let did = await createPeerDID()
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
//           print("DIDFunctionalities - DID is",createdDID ?? "DID unset")
         }
       return did
    }


@objc public func resolveDID(
    _ did: NSString,
    resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) -> Void {
    Task {
      let didDoc = await resolveDID(did: did)
      resolve(didDoc?.services[0].serviceEndpoint.uri)
    }
  }

     func resolveDID(did: NSString) async -> DIDDocument? {
       print("DIDFuncionalities - RESOLVING DID!")
         // Creates new PRISM DID
         let _did = did as String
         print("trying to resolve did ",_did)
         let document = try? await castor.resolveDID(did: DID(string: _did))
       print("DIDDOC is ", document)
//      let jsonString = try String(data: JSONEncoder().encode(document), encoding: .utf8)!
      print("DIDDOC JSON", document)
       
   
       return document
    }

@objc public func createFakeMsg(
    _ from: NSString,
    to: NSString,
    resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) -> Void {
    Task {
      let didDoc = await createFakeMsg(from: from, to:to)
      resolve(didDoc)
    }
  }

     func createFakeMsg(from: NSString, to: NSString) async -> String? {
       print("createFakeMsg -!")
         // Creates new PRISM DID

       
       let from = from as String
       let to = to as String
       let fromDID = try? DID(string:from)
       let toDID = try? DID(string: to)
       let msgtest = Message(
        piuri: "alex",
        from: fromDID!,
        to: toDID!,
        body: Data("{'alex':'andrei'}".utf8),
        thid: "alex"
       )
       print("msg is .", msgtest)
       
       do {
         let packedMessage = try await mercury.packMessage(msg: msgtest)
       }
       catch  {
         print(error)
       }
         await MainActor.run {
           self.packedMessage = packedMessage
           print("createFakeMsg - MSG is",packedMessage)
         }
       return packedMessage
    }


}
