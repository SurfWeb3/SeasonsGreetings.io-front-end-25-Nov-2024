import { useState } from "react";

import Container from "@/components/Common/Container";
import FlexBox from "@/components/Common/FlexBox";

import PrimaryNavBar from "./PrimaryNavBar";
import ToggleMenu from "./ToggleMenu";

export default function Header() {
  const [menuOpened, setMenuOpened] = useState(false);

  return (
    <FlexBox
      className="mx-auto py-3 flex items-center justify-center bg-gray-900 relative"
    >
      <Container className="items-center justify-between">
        <FlexBox className="items-center justify-center">
          <img
            src="/thirdweb.svg"
            alt="logo"
            className="w-[50px]"
          />
        </FlexBox>

        <PrimaryNavBar />

        <ToggleMenu
          opened={menuOpened}
          setOpened={setMenuOpened}
        />
      </Container>
    </FlexBox>
  );
}
