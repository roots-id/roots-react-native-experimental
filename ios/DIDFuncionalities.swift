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
    print("Hello World!",location,date)
  }
  
  //   @objc
  //   func createPrismDID(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> Void {
  //     //Task {
  //     createPrismDID()
  //     //}
  //     //resolve(self.createdDID)
  //   }
  //
  //   func createPrismDID() {
  //     print("Hello create prism DID!")
  // //      // Creates new PRISM DID
  // //      let did = try? await agent.createNewPrismDID(
  // //          // Add this if you want to provide a IndexPath
  // //          // keyPathIndex: <#T##Int?#>
  // //          // Add this if you want to provide an alias for this DID
  // //          // alias: <#T##String?#>
  // //          // Add any services available in the DID
  // //          services: [ .init(
  // //              id: "DemoID",
  // //              type: ["DemoType"],
  // //              serviceEndpoint: .init(uri: "DemoServiceEndpoint")
  // //          )
  // //     ])
  // //
  // //      await MainActor.run {
  // //        self.createdDID = did
  // //        print("DIDFunctionalities - DID is",createdDID ?? "DID unset")
  // //      }
  //   }
  //
  //   func resolveDID() async {
  //           guard let did = createdDID else { return }
  //
  //           // Resolves a DID and returns a DIDDocument
  //           let document = try? await castor.resolveDID(did: did)
  //
  //           await MainActor.run {
  //               self.resolvedDID = document
  //           }
  //       }
  //   }
  
}
