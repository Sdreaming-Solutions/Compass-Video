"use client";

import compass from "@/public/compass.png";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "./Navbar.module.scss";
import Navlink from "./Navlink";
import home from "@/public/icons/home.svg";
import tv from "@/public/icons/tv.svg";
import movie from "@/public/icons/movie.svg";
import star from "@/public/icons/star.svg";
import plus from "@/public/icons/plus2.svg";
import Search from "@/public/icons/search.svg";
import avatarImage from "@/public/default-avatar/1.png";
import { usePathname, useRouter } from "next/navigation";
import SearchBar from "./SearchBar";
import useLogin from "@/util/hooks/useLogin";
import SwitchUser from "./SwitchUser";
import { User } from "@/store/slices/users";

type Props = {};

export default function Navbar({}: Props) {
  const { values, actions } = useLogin();
  const active = usePathname();
  const router = useRouter();
  const [isSearchOpen, setIsSearchBarOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filter, setFilter] = useState("Tudo");
  const [isUsersOpen, setIsUsersOpen] = useState(false);
  let avatar: string | StaticImageData = avatarImage;
  if (values.user?.avatar?.gravatar.hash) {
    avatar = `https://gravatar.com/avatar/${values.user.avatar.gravatar.hash}?s=45`;
    if (values.user.avatar.tmdb.avatar_path) {
      avatar += `?d=${encodeURIComponent(
        `https://image.tmdb.org/t/p/w45${values.user.avatar.tmdb.avatar_path}`
      )}`;
    }
  }

  function closeFilter() {
    setIsFilterOpen(false);
  }

  function closeSearchBar() {
    setIsSearchBarOpen(false);
    closeFilter();
  }

  function filterSelect(option: string) {
    setFilter(option);
    closeFilter();
  }

  function onSearch(value: string) {
    router.replace(`/search?value=${value}&filter=${filter}`);
  }

  return (
    <nav className={styles.toplevel}>
      <Link
        href="/home"
        className={`${styles.logo} ${
          active.startsWith("/home") ? styles.active : ""
        }`}>
        <Image src={compass} alt="Compass Logo" />
      </Link>
      <div className={styles.navleft}>
        <Navlink href="/home" icon={home} current={active}>
          Início
        </Navlink>
        <Navlink href="/series" icon={tv} current={active}>
          Séries
        </Navlink>
        <Navlink href="/movie" icon={movie} current={active}>
          Filmes
        </Navlink>
        <Navlink href="/actors" icon={star} current={active}>
          Celebridades
        </Navlink>
      </div>
      <div className={styles.navright}>
        {isSearchOpen ? (
          <SearchBar
            filter={filter}
            onClose={closeSearchBar}
            openFilter={() => setIsFilterOpen(true)}
            closeFilter={() => setIsFilterOpen(false)}
            onSelect={filterSelect}
            isFilterOpen={isFilterOpen}
            onSearch={onSearch}
          />
        ) : (
          <>
            <button
              className={`${styles.navlink} ${styles.search}`}
              onClick={() => setIsSearchBarOpen(true)}>
              <Search /> Buscar
            </button>
            {values.user && (
              <Navlink href="/watchlist" icon={plus} current={active}>
                Minha lista
              </Navlink>
            )}
          </>
        )}
        {values.user ? (
          <div style={{ position: "relative" }}>
            <button
              className={styles.avatar}
              onClick={() => setIsUsersOpen((prev) => !prev)}>
              <Image
                src={avatar}
                alt="Avatar"
                width={45}
                height={45}
                className={styles.avatarimg}
              />
            </button>
            <SwitchUser isOpen={isUsersOpen} />
          </div>
        ) : (
          <Navlink href="/">Login</Navlink>
        )}
      </div>
    </nav>
  );
}
