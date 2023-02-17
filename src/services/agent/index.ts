

import * as Prismsdk from '../../utils/prism-agent-ts-open-api'
import { UpdateManagedDIDRequestFromJSON } from '../../utils/prism-agent-ts-open-api';
export class agent {
    apiKey: string;
    basePath: string;
    DIDRegistrarApi: Prismsdk.DIDRegistrarApi;
    DIDApi: Prismsdk.DIDApi;
    ConnectionApi: Prismsdk.ConnectionsManagementApi;
    CredentialApi: Prismsdk.IssueCredentialsProtocolApi;
    PresentationApi: Prismsdk.PresentProofApi;
    constructor() {
    this.apiKey = '8FctIBKmFAUOvofO1DVycHgz4C5ONccn',
    this.basePath = 'https://lw22q.atalaprism.io/prism-agent'

    this.DIDRegistrarApi = new Prismsdk.DIDRegistrarApi(new Prismsdk.Configuration({
        basePath: this.basePath,
        apiKey: this.apiKey
        })
    )

    this.DIDApi = new Prismsdk.DIDApi(new Prismsdk.Configuration({
        basePath: this.basePath,
        apiKey: this.apiKey
        })
    )

    this.ConnectionApi = new Prismsdk.ConnectionsManagementApi(new Prismsdk.Configuration({
        basePath: this.basePath,
        apiKey: this.apiKey
        })
    )

    this.CredentialApi = new Prismsdk.IssueCredentialsProtocolApi(new Prismsdk.Configuration({
        basePath: this.basePath,
        apiKey: this.apiKey
        })
    )

    this.PresentationApi = new Prismsdk.PresentProofApi(new Prismsdk.Configuration({
        basePath: this.basePath,
        apiKey: this.apiKey
        })
    )
 
    }

    async createIdentifier(data: any) {
        const params : Prismsdk.CreateManagedDidOperationRequest = {
            createManagedDidRequest: Prismsdk.CreateManagedDidRequestFromJSON({
                "documentTemplate": {
                    "publicKeys": [
                        {
                            "id": "key1",
                            "purpose": "authentication"
                        },
                        {
                            "id": "key2",
                            "purpose": "keyAgreement"
                        },
                    ],
                    "services": [
                        {
                            "id": "did:prism:test1",
                            "type": "LinkedDomains",
                            "serviceEndpoint": [
                                "https://roots1.com"
                            ]
                        },
                        {
                            "id": "did:prism:test2",
                            "type": "LinkedDomains",
                            "serviceEndpoint": [
                                "https://roots2.com"
                            ]
                        }
                    ]
                }
            })
        }
    const response : Prismsdk.CreateManagedDIDResponse = await this.DIDRegistrarApi.createManagedDid(params)
    const resp_json = Prismsdk.CreateManagedDIDResponseToJSON(response)
    console.log(resp_json)
    return response.longFormDid

}
//does ledger transaction and takes 50+ secs
    async publishManagedDID(data: any) {
    const didRef = data
    const params : Prismsdk.PublishManagedDidRequest = {
            "didRef": didRef
    }
    const response : Prismsdk.DIDOperationResponse = await this.DIDRegistrarApi.publishManagedDid(params)
    return response.scheduledOperation.didRef
}


  async resolveIdentifier(data: any) {
    //load json data which should contain did and be a string for prism
    const didRef = data
    const params: Prismsdk.GetDidRequest = {"didRef": didRef}
    const response  = await this.DIDApi.getDid(params)
    console.log("did resolved:")
    response.did.authentication
    let res_json = Prismsdk.DIDResponseToJSON(response)
    console.log(res_json)
    return response
  }
  async createConnection(data: any): Promise<any> {
    //load json data which should contain base64 oob url and be a string for prism
    const invitation = data.split("=")[1]
    let params: Prismsdk.AcceptConnectionInvitationOperationRequest = {
        acceptConnectionInvitationRequest: {'invitation': invitation}
    }
    let response: Prismsdk.Connection = await this.ConnectionApi.acceptConnectionInvitation(params)
    console.log("acceptInvite: ")
    console.log(response)
    return response
  }

  async listConnections(data: any): Promise<any> {
    let response: Prismsdk.ConnectionCollection = await this.ConnectionApi.getConnections()
    console.log("listConnections: ")
    let res_json = Prismsdk.ConnectionCollectionToJSON(response)
    console.log(res_json)
    return res_json
  }

  async listCredentialsByState(data: any): Promise<any> {
    let response: Prismsdk.IssueCredentialRecordCollection = await this.CredentialApi.getCredentialRecords()
    console.log("listCredentials: ")

    if (data===Prismsdk.IssueCredentialRecordAllOfProtocolStateEnum.OfferPending ||
        data===Prismsdk.IssueCredentialRecordAllOfProtocolStateEnum.OfferSent ||
        data===Prismsdk.IssueCredentialRecordAllOfProtocolStateEnum.OfferReceived ||
        data===Prismsdk.IssueCredentialRecordAllOfProtocolStateEnum.RequestPending ||
        data===Prismsdk.IssueCredentialRecordAllOfProtocolStateEnum.RequestSent ||
        data===Prismsdk.IssueCredentialRecordAllOfProtocolStateEnum.RequestReceived ||
        data===Prismsdk.IssueCredentialRecordAllOfProtocolStateEnum.ProblemReportPending ||
        data===Prismsdk.IssueCredentialRecordAllOfProtocolStateEnum.ProblemReportSent ||
        data===Prismsdk.IssueCredentialRecordAllOfProtocolStateEnum.ProblemReportReceived ||
        data===Prismsdk.IssueCredentialRecordAllOfProtocolStateEnum.CredentialPending ||
        data===Prismsdk.IssueCredentialRecordAllOfProtocolStateEnum.CredentialSent ||
        data===Prismsdk.IssueCredentialRecordAllOfProtocolStateEnum.CredentialReceived
        ) {
        //iterate through the response and get the credential records if the state is "credential_acked"
        for (let i = 0; i < response.items.length; i++) {
            if (response.items[i].protocolState == data) {
                let credRecord: Prismsdk.IssueCredentialRecord = response.items[i]
                let res_json = Prismsdk.IssueCredentialRecordToJSON(credRecord)
                console.log(res_json)
                return res_json
            }
        }
    } 
    //cannot find the credential record with the given state
    return 
  }

  async getCredentialsById(data: any): Promise<any> {
    let params: Prismsdk.GetCredentialRecordRequest = {"recordId": data}
    let response: Prismsdk.IssueCredentialRecord = await this.CredentialApi.getCredentialRecord(params)
    console.log("credential retrieved: ",response)
    return response


  
}

  async  listCredentials(data: any): Promise<any> {
    let response: Prismsdk.IssueCredentialRecordCollection = await this.CredentialApi.getCredentialRecords()
    console.log("listCredentials: ")
    let res_json = Prismsdk.IssueCredentialRecordCollectionToJSON(response)
    console.log(res_json)
    return res_json
  }

  async acceptConnectionInvitationRequest(data: any): Promise<any> {
    //load json data which should contain connection id and be a string for prism
    const invitation = data
    let params: Prismsdk.AcceptConnectionInvitationOperationRequest = {
        acceptConnectionInvitationRequest: {
                                                'invitation': invitation
                                            }
            }
    let response: Prismsdk.Connection = await this.ConnectionApi.acceptConnectionInvitation(params)
    console.log("acceptConnectionInvitationRequest: ")
    console.log(response)
    return response
  }

  async acceptCredentialOffer(data: any): Promise<any> {
    //load json data which should contain credential offer id and be a string for prism
    const offer = data
    let params: Prismsdk.AcceptCredentialOfferRequest = {
        'recordId': offer
    }
    let response: Prismsdk.IssueCredentialRecord = await this.CredentialApi.acceptCredentialOffer(params)
    console.log("acceptCredentialOffer: ")
    console.log(response)
    return response
  }

  async getAllPresentations(data: any): Promise<any> {
    let response: Prismsdk.PresentationStatus[] = await this.PresentationApi.getAllPresentation()
    console.log("getAllPresentations: ")
    let responses = []
    for (let i = 0; i < response.length; i++) {
        let res_json = Prismsdk.PresentationStatusToJSON(response[i])
        responses.push(res_json)
    }
    console.log(responses)
    return responses
  }

  async getPresentationByState(data: any): Promise<any> {
    let response: Prismsdk.PresentationStatus[] = await this.PresentationApi.getAllPresentation()
    console.log("getPresentationByState: ")
    if (data===Prismsdk.IssueCredentialRecordAllOfProtocolStateEnum.OfferPending ||
        data===Prismsdk.IssueCredentialRecordAllOfProtocolStateEnum.OfferSent ||
        data===Prismsdk.IssueCredentialRecordAllOfProtocolStateEnum.OfferReceived ||
        data===Prismsdk.IssueCredentialRecordAllOfProtocolStateEnum.RequestPending ||
        data===Prismsdk.IssueCredentialRecordAllOfProtocolStateEnum.RequestSent ||
        data===Prismsdk.IssueCredentialRecordAllOfProtocolStateEnum.RequestReceived ||
        data===Prismsdk.IssueCredentialRecordAllOfProtocolStateEnum.ProblemReportPending ||
        data===Prismsdk.IssueCredentialRecordAllOfProtocolStateEnum.ProblemReportSent ||
        data===Prismsdk.IssueCredentialRecordAllOfProtocolStateEnum.ProblemReportReceived ||
        data===Prismsdk.IssueCredentialRecordAllOfProtocolStateEnum.CredentialPending ||
        data===Prismsdk.IssueCredentialRecordAllOfProtocolStateEnum.CredentialSent ||
        data===Prismsdk.IssueCredentialRecordAllOfProtocolStateEnum.CredentialReceived
        ) {
        for (let i = 0; i < response.length; i++) {
            if (response[i].status == data) {
                let res_json = Prismsdk.PresentationStatusToJSON(response[i])
                return res_json
            }
        }
    }
    return 
  }

  async updatePresentation(data: any): Promise<any> {
    //load json data which should contain presentation id and be a string for prism
    const presentation_id = data
    let params: Prismsdk.UpdatePresentationRequest = {
        'id':presentation_id,
        requestPresentationAction : {'action': Prismsdk.RequestPresentationActionActionEnum.RequestAccept}
    }
    let response = await this.PresentationApi.updatePresentation(params)
    console.log("updatePresentation: should be empty for next line ")
    console.log(response)
    return response
  }

  async updateDid(data: any): Promise<any> {
    //load json data which should contain did and be a string for prism
    const did = data
    let params: Prismsdk.UpdateManagedDidRequest = {
        "didRef":did,
        "updateManagedDIDRequest": UpdateManagedDIDRequestFromJSON({
            "actions": [
                // {
                //     "actionType": "ADD_KEY",
                //     "addKey": {
                //         "id": "key3",
                //         "purpose": "authentication"
                //     }
                // }
                // ,{
                //     "actionType": "REMOVE_KEY",
                //     "removeKey": {
                //         "id": "key1"
                //     }
                // },
                // {
                //     "actionType": "REMOVE_SERVICE",
                //     "removeService": {
                //         "id": "did:prism:test1"
                //     }
                // },
                {
                    "actionType": "ADD_SERVICE",
                    "addService": {
                        "id": "did:prism:test3added",
                        "type": "LinkedDomains",
                        "serviceEndpoint": [
                            "https://test3added.com"
                        ]
                    }
                },
                // {
                //     "actionType": "UPDATE_SERVICE",
                //     "updateService": {
                //         "id": "did:prism:test2",
                //         "type": "LinkedDomains",
                //         "serviceEndpoint": [
                //             "https://test2.updated.com"
                //         ]
                //     }
                // }
            ]
        }    
    )
    }
    let response = await this.DIDRegistrarApi.updateManagedDid(params)
    console.log("updateDid: should be empty for next line ")
    console.log(response.scheduledOperation.didRef)
    return response
  }

  async getConnection(data: any): Promise<any> {
    let params : Prismsdk.GetConnectionRequest = { 'connectionId': data }

    let response: Prismsdk.Connection = await this.ConnectionApi.getConnection(params)
    console.log(response)
    return response
  }


}