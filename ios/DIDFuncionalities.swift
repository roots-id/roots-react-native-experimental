// DIDFuncionalities.swift
import Builders
import Domain
import Foundation
import PrismAgent 

@objc(DIDFuncionalities)
class DIDFuncionalities: NSObject {
  
  private let castor: Castor
  private let agent: PrismAgent
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

    self.agent = PrismAgent(mediatorServiceEnpoint: try! DID(string: "did:peer:2.Ez6LScc4S6tTSf5PnB7tWAna8Ee2aL7z2nRgo6aCHQwLds3m4.Vz6MktCyutFBcZcAWBnE2shqqUQDyRdnvcwqMTPqWsGHMnHyT.SeyJpZCI6Im5ldy1pZCIsInQiOiJkbSIsInMiOiJodHRwOi8vcm9vdHNpZC1tZWRpYXRvcjo4MDAwIiwiYSI6WyJkaWRjb21tL3YyIl19"))
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
       
       let m_did = try! DID(string: "did:peer:2.Ez6LScc4S6tTSf5PnB7tWAna8Ee2aL7z2nRgo6aCHQwLds3m4.Vz6MktCyutFBcZcAWBnE2shqqUQDyRdnvcwqMTPqWsGHMnHyT.SeyJpZCI6Im5ldy1pZCIsInQiOiJkbSIsInMiOiJodHRwOi8vcm9vdHNpZC1tZWRpYXRvcjo4MDAwIiwiYSI6WyJkaWRjb21tL3YyIl19")
         let did = try? await agent.createNewPeerDID(services: [ .init(
          id: "DemoID",
          type: ["DIDCommMessaging"],          
          serviceEndpoint: .init(uri: m_did.string)
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
       let url_oob = "https://mediator.rootsid.cloud?_oob=eyJ0eXBlIjoiaHR0cHM6Ly9kaWRjb21tLm9yZy9vdXQtb2YtYmFuZC8yLjAvaW52aXRhdGlvbiIsImlkIjoiNzk0Mjc4MzctY2MwNi00ODUzLWJiMzktNjg2ZWFjM2U2YjlhIiwiZnJvbSI6ImRpZDpwZWVyOjIuRXo2TFNtczU1NVloRnRobjFXVjhjaURCcFptODZoSzl0cDgzV29qSlVteFBHazFoWi5WejZNa21kQmpNeUI0VFM1VWJiUXc1NHN6bTh5dk1NZjFmdEdWMnNRVllBeGFlV2hFLlNleUpwWkNJNkltNWxkeTFwWkNJc0luUWlPaUprYlNJc0luTWlPaUpvZEhSd2N6b3ZMMjFsWkdsaGRHOXlMbkp2YjNSemFXUXVZMnh2ZFdRaUxDSmhJanBiSW1ScFpHTnZiVzB2ZGpJaVhYMCIsImJvZHkiOnsiZ29hbF9jb2RlIjoicmVxdWVzdC1tZWRpYXRlIiwiZ29hbCI6IlJlcXVlc3RNZWRpYXRlIiwibGFiZWwiOiJNZWRpYXRvciIsImFjY2VwdCI6WyJkaWRjb21tL3YyIl19fQ"
       do{
         try await agent.start()
         print("agent state", agent.state.rawValue)
//         let res = try await agent.parseInvitation(str: url_oob)
       }
       catch {
         
         print(error)
         print(error.localizedDescription)
         print("agent state error", agent.state.rawValue)
         
         
       }
       await MainActor.run {
         print("agent state", agent.state.rawValue)

//           print("DIDFunctionalities - DID is",createdDID ?? "DID unset")
       }
       
       
       
       return ""
    }


}
