import React, { useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    CircularProgress,
} from '@mui/material';
import { styled } from '@mui/system';
import { transferFrom } from "thirdweb/extensions/erc721";
import { TransactionButton, useActiveAccount } from 'thirdweb/react';
import { defineChain, getContract, toEther } from "thirdweb";
import { sepolia } from 'thirdweb/chains';
import { client } from '@/app/client';
import TransferMethod from '../transfer_method';
import axios from 'axios';
import toast from 'react-hot-toast';
// import { useContract, Web3Button } from "@thirdweb-dev/react";

const WEBSITE_WALLET_ADDRESS = process.env.NEXT_PUBLIC_WEBSITE_WALLET_ADDRESS;
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
interface NFTTransferModalProps {
    open: boolean;
    onClose: () => void;
    contractAddress: string;
    tokenId: bigint;
}

const StyledModal = styled(Modal)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const ModalContent = styled(Box)(({ theme }) => ({
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '24px',
    width: '90%',
    maxWidth: '400px',
}));

const NFTTransferModal: React.FC<NFTTransferModalProps> = ({
    open,
    onClose,
    contractAddress,
    tokenId = 1,
}) => {
    const [recipientAddress, setRecipientAddress] = useState('');
    const [recipientMessage, setRecipientMessage] = useState('');
    const [isTransferring, setIsTransferring] = useState(false);
    const account = useActiveAccount();
    const chain = defineChain(sepolia);
    const [transferMethod, setTransferMethod] = useState('CRYPTO');
    const [recipientEmail, setRecipientEmail] = useState('');
    const [emailError, setEmailError] = useState('');

    // Add email validation function
    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Update email handler
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const email = e.target.value;
        setRecipientEmail(email);

        if (!email) {
            setEmailError('Email is required');
        } else if (!validateEmail(email)) {
            setEmailError('Please enter a valid email address');
        } else {
            setEmailError('');
        }
    };

    const contract = getContract({
        client: client,
        chain: chain,
        address: contractAddress
    });

    const sendClaimTransaction = async (senderAddress: string, tokenId: string, recipientAddress?: string) => {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/nft`, {
                tokenId: tokenId.toString(),
                senderAddress: senderAddress,
                recipientAddress: recipientAddress,
                contractAddress: contractAddress,
                email: recipientEmail,
                claimMethod: transferMethod,
                message: recipientMessage,
            });
            toast.success("NFT Transfered Successfully!");
            setRecipientMessage("");
            setRecipientAddress("");
            setRecipientEmail("");
            setIsTransferring(false);
            onClose();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <StyledModal open={open} onClose={onClose}>
            <ModalContent>
                <Typography variant="h6" component="h2" color="text.primary" gutterBottom style={{ color: 'black' }}>
                    Transfer Your NFT
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph style={{ color: 'rgba(0, 0, 0, 0.7)' }}>
                    Send your newly claimed NFT to another wallet address.
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph style={{ color: 'rgba(0, 0, 0, 0.7)' }}>
                    Contract Address: {contractAddress}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph style={{ color: 'rgba(0, 0, 0, 0.7)' }}>
                    Token Id: {tokenId?.toString()}
                </Typography>
                <Box display="flex" flexDirection="column">
                    <Typography variant="body2" color="text.secondary" style={{ color: 'rgba(0, 0, 0, 0.7)' }}>
                        Method
                    </Typography>
                    <TransferMethod setTransferMethod={setTransferMethod} transferMethod={transferMethod} />
                    {
                        transferMethod === "CRYPTO" ? (
                            <Box display="flex" flexDirection="column" marginTop={2} className='gap-2'>
                                {/* <TextField
                                        fullWidth
                                        variant="outlined"
                                        label="Email"
                                        value={recipientEmail}
                                        onChange={(e) => setRecipientEmail(e.target.value)}
                                        size='small'
                                        className='text-[14px]'
                                        InputProps={{
                                            style: { color: 'black', fontSize: '14px' }
                                        }}
                                        InputLabelProps={{
                                            style: { color: 'rgba(0, 0, 0, 0.7)', fontSize: '14px' }
                                        }}
                                    /> */}
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="Wallet Address"
                                    value={recipientAddress}
                                    onChange={(e) => setRecipientAddress(e.target.value)}
                                    size='small'
                                    className='text-[14px]'
                                    InputProps={{
                                        style: { color: 'black', fontSize: '14px' }
                                    }}
                                    InputLabelProps={{
                                        style: { color: 'rgba(0, 0, 0, 0.7)', fontSize: '14px' }
                                    }}
                                />
                            </Box>
                        ) :
                            <Box display="flex" flexDirection="column" gap={2} marginTop={2}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="Email Address"
                                    value={recipientEmail}
                                    onChange={handleEmailChange}
                                    error={!!emailError}
                                    helperText={emailError}
                                    size='small'
                                    className='text-[14px]'
                                    InputProps={{
                                        style: { color: 'black', fontSize: '14px' }
                                    }}
                                    InputLabelProps={{
                                        style: { color: 'rgba(0, 0, 0, 0.7)', fontSize: '14px' }
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    variant="outlined"
                                    label="Message to NFT Recipient"
                                    value={recipientMessage}
                                    onChange={(e) => setRecipientMessage(e.target.value)}
                                    placeholder='Send a message with your NFT, and welcome your friend to the world of Web3'
                                    size='small'
                                    className='text-[14px] mt-2'
                                    InputProps={{
                                        style: { color: 'black', fontSize: '14px' }
                                    }}
                                    InputLabelProps={{
                                        style: { color: 'rgba(0, 0, 0, 0.7)', fontSize: '14px' }
                                    }}
                                />
                            </Box>
                    }
                </Box>
                <Box mt={2}>
                    {
                        transferMethod === "CRYPTO" ? (
                            <TransactionButton
                                transaction={() => transferFrom({
                                    contract: contract,
                                    from: account?.address || "",
                                    to: recipientAddress || "",
                                    tokenId: BigInt(tokenId),
                                })}
                                onTransactionConfirmed={() => sendClaimTransaction(account?.address || "", tokenId.toString(), recipientAddress)}
                            >
                                {isTransferring ? <CircularProgress size={24} /> : 'Transfer NFT'}
                            </TransactionButton>
                        ) : (
                            <TransactionButton
                                disabled={!recipientEmail || !!emailError}
                                transaction={() => transferFrom({
                                    contract: contract,
                                    from: account?.address || "",
                                    to: WEBSITE_WALLET_ADDRESS || "",
                                    tokenId: BigInt(tokenId),
                                })}
                                onTransactionConfirmed={() => sendClaimTransaction(account?.address || "", tokenId.toString(), recipientAddress)}
                            >
                                {isTransferring ? <CircularProgress size={24} /> : 'Transfer NFT'}
                            </TransactionButton>
                        )
                    }
                </Box>
            </ModalContent>
        </StyledModal>
    );
};

export default NFTTransferModal;