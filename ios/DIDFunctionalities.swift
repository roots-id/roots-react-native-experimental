// DIDFunctionalities.swift
import Builders
import Domain
import Foundation
import PrismAgent

@objc(DIDFunctionalities)
class DIDFunctionalities: NSObject {
  //  private let castor: Castor
  private let castor: Castor
  private let agent: PrismAgent
  private let mercury: Mercury
  private let apollo: Apollo
  private let pluto : Pluto
  @Published var createdDID: DID?
  @Published var resolvedDID: DIDDocument?
  
  @Published var createdDID1: DID?
  
  @Published var packedMessage: String?
  
  override
  init()
  {
    
    self.apollo = ApolloBuilder().build()
    self.pluto = PlutoBuilder().build()
    self.castor = CastorBuilder(
      apollo: self.apollo
    ).build()
    
    self.agent = PrismAgent(mediatorDID: try! DID(string: "did:peer:2.Ez6LSms555YhFthn1WV8ciDBpZm86hK9tp83WojJUmxPGk1hZ.Vz6MkmdBjMyB4TS5UbbQw54szm8yvMMf1ftGV2sQVYAxaeWhE.SeyJpZCI6Im5ldy1pZCIsInQiOiJkbSIsInMiOiJodHRwczovL21lZGlhdG9yLnJvb3RzaWQuY2xvdWQiLCJhIjpbImRpZGNvbW0vdjIiXX0"))
    self.mercury = MercuryBuilder(apollo: self.apollo, castor: self.castor, pluto: self.pluto).build()
    
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
        serviceEndpoint: [.init(uri: "alex",accept:[""],routingKeys:[""])]
      )
      ])
    
    await MainActor.run {
      self.createdDID = did
      print("DIDFunctionalities - DID is",createdDID)
    }
    return did
  }
  
  
  
  @objc public func createPeerDID(
    _ updateMediator: NSString,
    resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) -> Void {
    Task {
      print("DIDFunctionalities - creating peer did w/update mediator",updateMediator)
      let did = await createPeerDID(updateMediator:updateMediator)
      print("DIDFunctionalities - peer did w/update mediator",did)
      resolve(did?.string)
    }
  }
  
  func createPeerDID(updateMediator : NSString ) async -> DID? {
    print("DIDFunctionalities - Called create peer DID!")
    // Creates new peer DID
    let _updateMediator : Bool
    if updateMediator == "true" {
      _updateMediator = true
    }
    else {
      _updateMediator = false
    }
    print("DIDFunctionalities - _updateMediator",_updateMediator)
    let did = try? await agent.createNewPeerDID(
      services: [.init(
        id: "#didcomm-1",
        type: ["DIDCommMessaging"],
        serviceEndpoint: [.init(uri: "did:peer:2.Ez6LSms555YhFthn1WV8ciDBpZm86hK9tp83WojJUmxPGk1hZ.Vz6MkmdBjMyB4TS5UbbQw54szm8yvMMf1ftGV2sQVYAxaeWhE.SeyJpZCI6Im5ldy1pZCIsInQiOiJkbSIsInMiOiJodHRwczovL21lZGlhdG9yLnJvb3RzaWQuY2xvdWQiLCJhIjpbImRpZGNvbW0vdjIiXX0")]
      )],
      updateMediator: _updateMediator)
    
    print("DIDFunctionalities - new peer did is",did?.string)
    
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
      let didDoc = await resolveDID(did: did)
      print("DIDFunctionalities - resolved did document",didDoc)
      resolve(didDoc.debugDescription)
    }
  }
  
  func resolveDID(did: NSString) async -> DIDDocument? {
    print("DIDFunctionalities - RESOLVING DID!")
    // Creates new PRISM DID
    let _did = did as String
    print("DIDFunctionalities - trying to resolve did ",_did)
    let document = try? await castor.resolveDID(did: DID(string: _did))
    print("DIDFunctionalities - DIDDOC is ", document)
    //      let jsonString = try String(data: JSONEncoder().encode(document), encoding: .utf8)!
    print("DIDFunctionalities - DIDDOC JSON", document)
    
    return document
  }
  
  @objc public func StartPrismAgent(
    _ mediatorDid: NSString,
    resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) -> Void {
    Task {
      do {
        let mediatorDID = try DID(string: mediatorDid as String)
        let didDoc = await StartPrismAgent(mediatorDID: mediatorDID)
        resolve(didDoc)
      } catch {
        reject("INVALID_DID", "Failed to parse DID from input string", error)
      }
    }
  }
  
  func StartPrismAgent(mediatorDID: DID) async -> String? {
    print("StartPrismAgent -!", mediatorDID)
    let fromDID = mediatorDID
    
    do {
      try await agent.start()
    } catch {
      print("starting agent error", error)
      print(error.localizedDescription)
      return (error.localizedDescription)
    }
    
    do {
      try agent.startFetchingMessages()
      print("started fetching messages")
    } catch {
      print("startFetchingMessages error", error)
      return error.localizedDescription
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
  
  
  @objc public func sendPrismMsg(
    _ msg: NSString,
    from: NSString,
    to: NSString,
    resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) -> Void {
    Task {
      let result = await sendPrismMsg(msg: msg, from: from, to: to)
      resolve(result)
    }
  }
  
  func sendPrismMsg(msg: NSString, from: NSString, to:NSString ) async -> String? {
    print("sendPrismMsg -!")
    let msg = msg as String
    let from = from as String
    let to = to as String
    let fromDID = try! DID(string:from)
    let toDID = try! DID(string:to)
    let sendingMessage = BasicMessage(
      from: fromDID,
      to: toDID,
      body: .init(content: msg)
    )
    print(sendingMessage)
    
    do{
      let message = try await agent.sendMessage(message: sendingMessage.makeMessage())
      print("sending message")
      print(message)
      return "sent"
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
    var messages = ""
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
        if latestTime == nil || $0.createdTime > latestTime {
          messages = str
          latestTime = $0.createdTime
          print($0)
        }
        //            messages = messages+"\n"+str
        
        print("Received message: \($0.piuri) | messages \(messages)")
      }
    }
    catch {
      print(error)
      messages = messages+"\n"+error.localizedDescription
    }
    
    return messages
  }
  
  @objc public func AcceptConnection(
      _ resolve: @escaping RCTPromiseResolveBlock,
      rejecter reject: @escaping RCTPromiseRejectBlock
    ) -> Void {
      Task {
        let result = AcceptConnection()
        resolve(result)
      }
    }
    
    func AcceptConnection() -> String?
  {
      print("AcceptConnection -!")
      var messages = ""
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
          
          print("Received connection request")
          let req = try ConnectionRequest(fromMessage: $0)
          print(req)
          let resp = try await agent.sendMessage(message: ConnectionAccept(fromRequest: req).makeMessage())
          print("connection accepted \($0.id)")
            
          }
      }
      catch {
        print(error)
        messages = messages+"\n"+error.localizedDescription
      }
      
      return messages
    }
    
  
}
