export enum MessageType {
  BLOCKCHAIN_URL = 'blockchainUrlMsgType',
  CREDENTIAL_JSON = 'jsonCredential',
  DID = 'didMsgType',
  PROMPT_RETRY_PROCESS = 'rootsFailedProcessingMsgType',
  PROMPT_ACCEPTED_CREDENTIAL = 'rootsAcceptedCredentialMsgType',
  PROMPT_PREVIEW_ACCEPT_DENY_CREDENTIAL = 'rootsPreviewAcceptDenyCredentialMsgType',
  PROMPT_OWN_CREDENTIAL = 'rootsOwnCredentialMsgType',
  PROMPT_OWN_DID = 'rootsOwnDidMsgType',
  PROMPT_PUBLISH = 'rootsPromptPublishMsgType',
  PROMPT_ISSUED_CREDENTIAL = 'rootsIssuedCredentialMsgType',
  STATUS = 'statusMsgType',
  TEXT = 'textMsgType',
  CRED_VIEW = 'CRED_VIEW',
  CRED_REVOKE = 'CRED_REVOKE',
  CRED_VERIFY = 'CRED_VERIFY',
  CRED_ACCEPTED = 'CRED_ACCEPTED',
  CRED_PREVIEW = 'CRED_PREVIEW',
  CRED_ACCEPT = 'CRED_ACCEPT',
  CRED_DENY = 'CRED_DENY'
}
