"use client";

import { Box, Button } from "@mui/material";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { client } from "@/app/client";
import { defineChain, sepolia } from "thirdweb/chains";
import { getUserEmail } from "thirdweb/wallets/in-app";
import toast from "react-hot-toast";
import { signMessage } from "thirdweb/utils";
import { CircularProgress } from "@mui/material";
import Image from "next/image";
import thirdwebIcon from "@public/thirdweb.svg";
import { GetNftByContractAddress } from "@/common/nfts";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const Header = () => {
    return (
        <header className="flex flex-row items-center mb-6">
            <Image
                src={thirdwebIcon}
                alt=""
                className="size-[150px] md:size-[150px]"
                style={{
                    filter: "drop-shadow(0px 0px 24px #a726a9a8)",
                }}
            />

            <h1 className="text-2xl tablet:text-6xl font-semibold tablet:font-bold tracking-tighter text-zinc-100">
                NFT Claim App
            </h1>
        </header>
    );
}

export default function Claim() {
    const chain = defineChain(sepolia);
    const { claim_token } = useParams();
    const [claimTokenData, setClaimTokenData] = useState<any>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [isClaimLoading, setIsClaimLoading] = useState(false);

    const account = useActiveAccount();
    const router = useRouter();

    const checkClaimToken = async () => {
        try {
            const { data: { data } } = await axios.get(`${BACKEND_URL}/api/v1/nft/claim/${claim_token}`);
            if (data?.isClaimed) {
                toast.error("NFT already claimed");
                router.push("/");
            }
            setClaimTokenData(data);
        } catch (error) {
            toast.error("Invalid claim auth token");
            router.push("/");
            console.log(error);
        }
    }

    useEffect(() => {
        checkClaimToken();
    }, []);

    const fetchUserEmail = async () => {
        try {
            const email = await getUserEmail({ client });
            setUserEmail(email || null);
        } catch (error) {
            console.error("Error fetching email:", error);
        }
    };

    useEffect(() => {
        if (account) {
            fetchUserEmail();
        }
    }, [account]);

    const handleClaim = async () => {
        try {
            setIsClaimLoading(true);
            if (!account || !claimTokenData) return;

            // Create message to sign
            const message = JSON.stringify({
                tokenId: claimTokenData.tokenId,
                email: userEmail,
                claimAuthToken: claim_token,
                walletAddress: account.address,
                contractAddress: claimTokenData.contractAddress
            });

            // Sign the message
            const signature = await signMessage({ message, account });

            // Send claim request to backend with signature
            const response = await axios.post(`${BACKEND_URL}/api/v1/nft/claim/${claim_token}`, {
                signature,
                message,
                walletAddress: account.address,
                contractAddress: claimTokenData.contractAddress
            });

            const nft = GetNftByContractAddress(claimTokenData.contractAddress);

            toast.success(`NFT claimed successfully! You received a ${nft?.name} NFT!`);
            router.push(`/nft/${nft?.id}?claimed=true`);
        } catch (error) {
            console.error("Claim error:", error);
            toast.error("Failed to claim NFT");
        } finally {
            setIsClaimLoading(false);
        }
    }

    return (
        <main className="p-4 pb-10 min-h-[100vh] flex items-center justify-center container max-w-screen-lg mx-auto">
            <div className="py-20 text-center flex flex-col gap-5">
                <div>
                    <Header />
                    <div className="flex gap-5 flex-col">
                        <div>
                            <ConnectButton
                                client={client}
                                chain={chain}
                                connectButton={{
                                    label: "Login"
                                }}
                            />
                        </div>
                        <div>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleClaim}
                                disabled={!claimTokenData || claimTokenData.email !== userEmail || claimTokenData.isClaimed}
                            >
                                {isClaimLoading ? (
                                    <div className="flex items-center gap-2">
                                        <CircularProgress size={20} color="inherit" />
                                        <span>Claiming...</span>
                                    </div>
                                ) : (
                                    "Claim a FREE NFT"
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
