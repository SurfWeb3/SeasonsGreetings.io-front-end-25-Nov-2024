"use client";

import Container from "@/components/Common/Container";
import { EASTER_NFTS } from "@/common/nfts";
import Link from "next/link";

export default function EasterPage() {
    return (
        <Container className="my-16 flex-col">
            <h1 className="text-3xl font-bold text-center mb-8 text-white">Easter NFTs</h1>
            <div className="flex flex-wrap justify-center gap-4">
                {EASTER_NFTS.map((nft, index) => (
                    <Link key={index} href={`/nft/${nft.id}`} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-700 max-w-[350px]">
                        <div className="relative aspect-square">
                            <img
                                src={nft.image}
                                alt={nft.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="p-5">
                            <h2 className="text-xl font-semibold text-white mb-2">{nft.name}</h2>
                            <p className="text-gray-400 text-sm mb-4">{nft.description}</p>
                            <div className="text-xs text-gray-500 break-all">
                                Contract: {nft.contract_address}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </Container>
    );
}