import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import { userStore } from "../state/userStore";
import { Models } from "appwrite";
import LogoutModal from "./LogoutModal";
import { Link } from "react-router-dom";
export default function AppNavbar() {
  const user = userStore(
    (state) => state.user
  ) as Models.User<Models.Preferences>;
  return (
    <Navbar>
      <NavbarBrand>
        <Link to="/">
          <p className="font-bold text-inherit">ChatApp</p>
        </Link>
      </NavbarBrand>

      <NavbarContent justify="end">
        <NavbarItem>
          <h1>{user.name}</h1>
        </NavbarItem>

        <NavbarItem>
          <LogoutModal />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
