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
    self.agent = PrismAgent(mediatorServiceEnpoint: try! DID(string: "did:peer:2.Ez6LSms555YhFthn1WV8ciDBpZm86hK9tp83WojJUmxPGk1hZ.Vz6MkmdBjMyB4TS5UbbQw54szm8yvMMf1ftGV2sQVYAxaeWhE.SeyJpZCI6Im5ldy1pZCIsInQiOiJkbSIsInMiOiJodHRwczovL21lZGlhdG9yLnJvb3RzaWQuY2xvdWQiLCJhIjpbImRpZGNvbW0vdjIiXX0"))
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
      print("DIDFunctionalities - creating prism DID asynchronously", self.createdDID)
      let did = await createPeerDID()
      print("DIDFunctionalities - created prism DID asynchronously", self.createdDID)
      print("DIDFunctionalities - returning prism DID", did)
      resolve(did?.string)
    }
  }
     func createPeerDID() async -> DID? {
       print("DIDFuncionalities - Called create peer DID!")
         // Creates new PRISM DID
       let did = try? await agent.createNewPeerDID(
             // Add this if you want to provide a IndexPath
             // keyPathIndex: <#T##Int?#>
             // Add this if you want to provide an alias for this DID
             // alias: <#T##String?#>
             // Add any services available in the DID
             services: [ .init(
                 id: "DemoID",
                 type: ["DemoType"],
                 serviceEndpoint: .init(uri: "DemoServiceEndpoint")
             )],updateMediator: false
        )

         await MainActor.run {
           self.createdDID = did
           print("DIDFunctionalities - DID is",createdDID ?? "DID unset")
         }
       return did
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
    _ updatemediator: NSString,
    resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) -> Void {
    Task {
      let did = await createPeerDID(updatemediator:updatemediator)
      resolve(did?.string)
    }
  }

     func createPeerDID(updatemediator : NSString ) async -> DID? {
       print("DIDFuncionalities - Called create peer DID!")
         // Creates new peer DID
       let _updatemediator : Bool
        if updatemediator == "true" {
           _updatemediator = true
        }
        else {
          _updatemediator = false
        }
        print("_updatemediator",_updatemediator)
        let did = try? await agent.createNewPeerDID(updateMediator: _updatemediator)

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
      resolve(didDoc?.id.string)
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

@objc public func StartPrismAgent(
    _ mediatorDid: NSString,
    resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) -> Void {
    Task {
      let didDoc = await StartPrismAgent(mediatorDid: mediatorDid)
      resolve(didDoc)
    }
  }

     func StartPrismAgent(mediatorDid: NSString) async -> String? {
       print("StartPrismAgent -!")
       let mediatorDid = mediatorDid as String
       let fromDID = try? DID(string:mediatorDid)

       do{
         try await agent.start()
       }
       catch {
         print(error)
       }

       print(agent.state.rawValue)
       await MainActor.run {
        print(agent.state.rawValue)
        }
       return ""
    }

@objc public func parseOOBMessage(
    _ url: NSString,
    resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) -> Void {
    Task {
      let result = await parseOOBMessage(url: url)
      resolve(result)
    }
  }

     func parseOOBMessage(url: NSString) async -> String? {
       print("parseOOBMessage -!")
       let url = url as String
       print(url)

       do{
        let message = try await agent.parseOOBInvitation(url: url)
        print(message)
//        try await agent.acceptDIDCommInvitation(invitation: message)

       }
       catch {
         print(error)
       }
       await MainActor.run {
        print(agent.state.rawValue)
        }
       return ""
    }


}
