import React from "react";
import styles from "./SearchBar.module.scss";

type Props = { onSelect: (option: string) => void; isOpen: boolean };

export default function Filter({ onSelect, isOpen }: Props) {
  function handleSelect(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    onSelect(event.currentTarget.innerText);
  }

  return (
    <dialog
      open={isOpen}
      className={`${styles.filter} ${isOpen ? styles.filterOpen : ""}`}>
      <button
        type="button"
        onClick={(event) => {
          handleSelect(event);
        }}>
        Tudo
      </button>
      <button
        type="button"
        onClick={(event) => {
          handleSelect(event);
        }}>
        Filmes
      </button>
      <button
        type="button"
        onClick={(event) => {
          handleSelect(event);
        }}>
        Coleções
      </button>
      <button
        type="button"
        onClick={(event) => {
          handleSelect(event);
        }}>
        Séries
      </button>
      <button
        type="button"
        onClick={(event) => {
          handleSelect(event);
        }}>
        Celebridades
      </button>
    </dialog>
  );
}
