import Box from "@mui/material/Box";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import IconButton from "@mui/material/IconButton";
import clsx from "clsx";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";

import Container from "@/components/Common/Container";

import FlexBox from "@/components/Common/FlexBox";
import { navLinks } from "../PrimaryNavBar";

type Props = {
  opened: boolean;
  setOpened: Dispatch<SetStateAction<boolean>>;
};

export default function HeaderMenu({
  opened,
  setOpened,
}: Props) {
  const toggle = () => setOpened((prev) => !prev);
  const hide = () => setOpened(false);


  return (
    <ClickAwayListener onClickAway={hide}>
      <Box className="z-10">
        <IconButton
          className="tablet:hidden relative w-12 h-12 flex flex-col text-white toggle-button"
          onClick={toggle}
          sx={{
            "& div:first-of-type": {
              transform: opened
                ? "rotate(45deg) translate(6px, 6px)"
                : "rotate(0deg) translate(0, 0)",
            },
            "& div:last-of-type": {
              transform: opened
                ? "rotate(-45deg) translate(6px, -6px)"
                : "rotate(0deg) translate(0, 0)",
            },
          }}
        >
          <div className="absolute top-3.5 w-7 h-0.5 bg-white transition-all duration-500 text-4xl" />
          <div
            className={clsx(
              "absolute w-7 h-0.5 bg-white transition-all duration-500 text-4xl",
              opened ? "opacity-0" : "opacity-100",
            )}
          />
          <div className="absolute bottom-3.5 w-7 h-0.5 bg-white transition-all duration-500 text-4xl" />
        </IconButton>
        <FlexBox
          className={clsx(
            "tablet:hidden absolute top-full left-0 w-full overflow-hidden",
            !opened && "h-0",
          )}
          sx={{
            backgroundColor: "#0007 !important",
            backdropFilter: "blur(5px)",
          }}
        >
          <Container>
            <FlexBox className="w-full flex-col py-4">
              {navLinks.map(({ href, text }) => (
                <Link
                  key={href}
                  className="text-lg py-2"
                  onClick={hide}
                  href={href}
                >
                  {text}
                </Link>
              ))}
            </FlexBox>
          </Container>
        </FlexBox>
      </Box>
    </ClickAwayListener>
  );
}
