'use client';

import Image from "next/image";
import thirdwebIcon from "@public/thirdweb.svg";
import Link from "next/link";
import { FaGift, FaHatWizard, FaDragon, FaLeaf } from "react-icons/fa";
import { GiPartyPopper, GiAbdominalArmor } from "react-icons/gi";

const categories = [
  {
    title: "Halloween NFTs",
    description: "Spooky and unique Halloween cards",
    icon: <FaHatWizard className="text-4xl text-orange-500" />,
    href: "/halloween",
    gradient: "from-orange-500 to-purple-600",
  },
  {
    title: "Thanksgiving NFTs",
    description: "Gratitude-themed holiday cards",
    icon: <img src="/assets/thanskforgiving.png" alt="Thanksgiving" className="w-16 h-16" />,
    href: "/thanksgiving",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    title: "Christmas NFTs",
    description: "Discover festive Christmas cards",
    icon: <FaGift className="text-4xl text-red-500" />,
    href: "/christmas",
    gradient: "from-red-500 to-green-600",
  },
  {
    title: "New Year NFTs",
    description: "Welcome the New Year with exclusive cards",
    icon: <GiPartyPopper className="text-4xl text-blue-500" />,
    href: "/newyear",
    gradient: "from-blue-500 to-purple-600",
  },
  {
    title: "Chinese New Year",
    description: "Celebrate Lunar New Year with special cards",
    icon: <FaDragon className="text-4xl text-yellow-500" />,
    href: "/chinesenewyear",
    gradient: "from-yellow-500 to-red-600",
  },
  {
    title: "Easter NFTs",
    description: "Spring-themed Easter cards",
    icon: <FaLeaf className="text-4xl text-green-500" />,
    href: "/easter",
    gradient: "from-green-500 to-emerald-600",
  },
];

export default function HomePage() {
  return (
    <main className="p-4 pb-10 min-h-[100vh] flex justify-center container max-w-screen-xl mx-auto">
      <div className="py-20 text-center flex flex-col gap-8 w-full">
        <div>
          <header className="flex flex-col md:flex-row justify-center items-center gap-4 mb-12">
            <Image
              src={thirdwebIcon}
              alt=""
              className="size-[120px] md:size-[150px]"
              style={{
                filter: "drop-shadow(0px 0px 24px #a726a9a8)",
              }}
            />
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-zinc-100">
              NFT SHARE
            </h1>
          </header>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-16">
            Explore our diverse collection of NFTs across different categories
          </p>
        </div>

        <div className="grid grid-cols-1 mobmd:grid-cols-2 tablet:grid-cols-4 gap-6 px-4 justify-center">
          {categories.map((category, index) => (
            <Link
              key={index}
              href={category.href}
              className="group relative overflow-hidden rounded-xl bg-gray-800/50 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${category.gradient} transition-opacity duration-300`} />

              <div className="relative z-10 flex flex-col items-center text-center gap-4">
                {category.icon}
                <h2 className="text-xl font-semibold text-white">
                  {category.title}
                </h2>
                <p className="text-gray-400 text-sm">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}