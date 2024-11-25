export type TransferMethod = 'CRYPTO' | 'EMAIL';

export interface NFTTransferFormData {
  recipientAddress: string;
  recipientEmail: string;
  transferMethod: TransferMethod;
}

export interface NFTTransferModalProps {
  open: boolean;
  onClose: () => void;
  contractAddress: string;
  tokenId: bigint;
}