// DIDFuncionalities.swift
import Builders
import Domain
import Foundation
import PrismAgent 

@objc(DIDFuncionalities)
class DIDFuncionalities: NSObject {
  //  private let castor: Castor
  private let castor: Castor
  @Published var agent: PrismAgent
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

    self.agent = PrismAgent(mediatorServiceEnpoint: try? DID(string: "did:peer:2.Ez6LSms555YhFthn1WV8ciDBpZm86hK9tp83WojJUmxPGk1hZ.Vz6MkmdBjMyB4TS5UbbQw54szm8yvMMf1ftGV2sQVYAxaeWhE.SeyJpZCI6Im5ldy1pZCIsInQiOiJkbSIsInMiOiJodHRwczovL21lZGlhdG9yLnJvb3RzaWQuY2xvdWQiLCJhIjpbImRpZGNvbW0vdjIiXX0"))
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
        let did = try? await agent.createNewPeerDID(
          services: [.init(
            id: "#didcomm-1",
            type: ["DIDCommMessaging"],
            serviceEndpoint: .init(uri: "did:peer:2.Ez6LSms555YhFthn1WV8ciDBpZm86hK9tp83WojJUmxPGk1hZ.Vz6MkmdBjMyB4TS5UbbQw54szm8yvMMf1ftGV2sQVYAxaeWhE.SeyJpZCI6Im5ldy1pZCIsInQiOiJkbSIsInMiOiJodHRwczovL21lZGlhdG9yLnJvb3RzaWQuY2xvdWQiLCJhIjpbImRpZGNvbW0vdjIiXX0",
                                   routingKeys: ["did:peer:2.Ez6LSms555YhFthn1WV8ciDBpZm86hK9tp83WojJUmxPGk1hZ.Vz6MkmdBjMyB4TS5UbbQw54szm8yvMMf1ftGV2sQVYAxaeWhE.SeyJpZCI6Im5ldy1pZCIsInQiOiJkbSIsInMiOiJodHRwczovL21lZGlhdG9yLnJvb3RzaWQuY2xvdWQiLCJhIjpbImRpZGNvbW0vdjIiXX0"])
        )],
          updateMediator: _updatemediator)
       print("did", did?.string)
       
       
   
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
         let _did = did as String
         let document = try? await castor.resolveDID(did: DID(string: _did))
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
       self.agent = PrismAgent(mediatorServiceEnpoint: fromDID)
       
       do{
         try await agent.start()
       }
       catch {
         print("starting agent error",error)
         print(error.localizedDescription)
        

       }
       
       do{
         try await agent.start()
       }
       catch {
         print("starting agent error2",error)
         print(error.localizedDescription)
        

       }
       
       do {
        try agent.startFetchingMessages()
         print("started fetching messages")
       }
        catch {
          print("startFetchingMessages error",error)
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
        let message = try await agent.parseInvitation(str: url)
         print("parsing invitations")
        print(message)        
       }
       catch {
         print(error)
       }
       await MainActor.run {
         print("message")
        }
       return ""
    }

@objc public func getMessages(
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) -> Void {
    Task {
      let result = getMessages()
      resolve(result)
    }
  }

  func getMessages() -> String? {
     print("getMessages -!")
     var latestMessage: String?
     var latestTime: Date!

     do{
          agent.handleMessagesEvents().sink {
            switch $0 {
            case .finished:
                print("Finished message retrieval")
            case .failure(let error):
                print(error.localizedDescription)
            }
        } receiveValue: {
          let str = String(data: $0.body, encoding: .utf8)!
          
          print("Received message: \($0.id) | type \($0.piuri) | \(str) | from \($0.from?.string)| to \($0.to?.string)| createdTime \($0.createdTime)")

          if latestTime == nil || $0.createdTime > latestTime {
              latestMessage = str
              latestTime = $0.createdTime
          }
        }
       print("latest messages", latestMessage)
     }
     catch {
       print(error)
     }
     return latestMessage
  }

}
