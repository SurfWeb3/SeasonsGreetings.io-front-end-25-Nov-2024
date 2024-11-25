"use client";

import { client } from "@/app/client";
import { GetNftById } from "@/common/nfts";
import Container from "@/components/Common/Container";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import { useState } from "react";
import { defineChain, toEther, getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { getContractMetadata } from "thirdweb/extensions/common";
import { claimTo, getActiveClaimCondition, nextTokenIdToMint } from "thirdweb/extensions/erc721";
import { TransactionButton, ConnectButton, MediaRenderer, useActiveAccount, useReadContract } from "thirdweb/react";
import thirdwebIcon from "@public/thirdweb.svg";
import { Typography } from "@mui/material";
import { Box } from "@mui/material";
import NFTTransferModal from "@/components/modal/NFTTransferModal";

export default function NftPage() {
    const params = useParams();
    const id = params.id;
    const searchParams = useSearchParams();
    const claimed = searchParams.get("claimed") || false;

    const nft = GetNftById(parseInt(id as string));

    if (!nft) {
        return <Container>Nft not found</Container>;
    }

    const account = useActiveAccount();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [claimedTokenId, setClaimedTokenId] = useState<bigint | undefined>(undefined);

    // Replace the chain with the chain you want to connect to
    const chain = defineChain(sepolia);

    const [quantity, setQuantity] = useState(1);

    // Replace the address with the address of the deployed contract
    const contract = getContract({
        client: client,
        chain: chain,
        address: nft.contract_address
    });

    const { data: contractMetadata, isLoading: isContractMetadataLaoding } = useReadContract(getContractMetadata,
        { contract: contract }
    );

    const { data: totalNFTSupply, isLoading: isTotalSupplyLoading } = useReadContract(nextTokenIdToMint,
        { contract: contract }
    );

    const { data: claimCondition } = useReadContract(getActiveClaimCondition,
        { contract: contract }
    );

    const getPrice = (quantity: number) => {
        const total = quantity * parseInt(claimCondition?.pricePerToken.toString() || "0");
        return toEther(BigInt(total));
    }

    const showMintedNFTModal = () => {
        setClaimedTokenId(totalNFTSupply);
        setIsModalOpen(true);
    };

    return (
        <Container className="justify-center w-full">
            <div className="py-20 text-center flex flex-col gap-5">
                <div>
                    <Header />
                    <Box className="flex flex-col items-center gap-2">
                        {account?.address && (
                            <Box className="flex flex-col items-center">
                                <Typography className="text-white text-[14px]">
                                    WALLET ADDRESS CLICK HERE FOR SETTINGS
                                </Typography>
                            </Box>
                        )}
                        <ConnectButton
                            client={client}
                            chain={chain}
                            connectButton={{
                                label: "Login"
                            }}
                        />
                    </Box>
                    <Box className="flex flex-col justify-center mt-4">
                        <Typography className="text-white text-[14px]">
                            NEW TO CRYPTO, WALLETS AND NFTS?
                        </Typography>
                        <a href="https://surfweb3.com/new-to-crypto-wallets-and-nfts/" target="_blank" rel="noopener noreferrer" className="text-[14px] underline hover:text-blue-400">CLICK HERE</a>
                    </Box>
                    <div className="flex flex-col items-center mt-4">
                        {isContractMetadataLaoding ? (
                            <p>Loading...</p>
                        ) : (
                            <>
                                <MediaRenderer
                                    client={client}
                                    src={contractMetadata?.image}
                                    className="rounded-xl"
                                />
                                <h2 className="text-2xl font-semibold mt-4">
                                    {contractMetadata?.name}
                                </h2>
                                <p className="text-lg mt-2">
                                    {contractMetadata?.description}
                                </p>
                            </>
                        )}
                        {!claimed && (
                            <TransactionButton
                                transaction={() => claimTo({
                                    contract: contract,
                                    to: account?.address || "",
                                    quantity: BigInt(quantity),
                                })}
                                onTransactionConfirmed={async () => {
                                    alert("NFT Claimed!");
                                    showMintedNFTModal();
                                    setQuantity(1);
                                }}
                                className="mt-4"
                            >
                                {`Claim NFT (${getPrice(quantity)} ETH)`}
                            </TransactionButton>
                        )}
                    </div>
                </div>
            </div>
            <NFTTransferModal contractAddress={nft.contract_address} open={isModalOpen} onClose={() => setIsModalOpen(false)} tokenId={claimedTokenId as bigint} />
        </Container>
    );
}

const Header = () => {
    return (
        <header className="flex flex-row justify-center items-center mb-6">
            <Image
                src={thirdwebIcon}
                alt=""
                className="size-[150px] md:size-[150px]"
                style={{
                    filter: "drop-shadow(0px 0px 24px #a726a9a8)",
                }}
            />

            <h1 className="text-2xl mobmd:text-6xl font-semibold mobmd:font-bold tracking-tighter text-zinc-100">
                NFT Claim App
            </h1>
        </header>
    );
}