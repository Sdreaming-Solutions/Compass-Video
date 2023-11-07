"use client";

import compass from "@/public/compass.png";
import tmdb from "@/util/tmdb";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./Login.module.scss";
import Button from "./components/button";
import Card from "./components/card";
import Link from "next/link";
import { actions, useDispatch, useSelector } from "@/store";
import { useEffect } from "react";
import useLogin from "@/util/hooks/useLogin";

type Props = { searchParams: { [key: string]: string | string[] | undefined } };

export default function LoginPage({ searchParams }: Props) {
  const router = useRouter();
  const dispatch = useDispatch();
  useLogin();

  useEffect(() => {
    if (searchParams["request_token"]) {
      dispatch(actions.users.login(searchParams["request_token"]));
      router.replace("/home");
    }
  }, [dispatch, router, searchParams]);

  async function authenticate() {
    try {
      const requestToken = (await tmdb.get("authentication/token/new"))[
        "request_token"
      ];
      router.replace(
        `/login/${requestToken}?redirect_to=http://localhost:3000`
      );
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <main className={styles.main}>
      <Card className={styles.card}>
        <h1>Compass Video</h1>
        <p className={styles.subtitle}>
          Acesse sua conta para ver nossos títulos
        </p>
        <Button className={styles.button} onClick={authenticate}>
          Iniciar sessão com TMDB
        </Button>
        <p className={styles.guest}>
          Não tem conta? <Link href="/home">Acesse como convidado</Link>
        </p>
        <Image src={compass} alt="Compass Logo" className={styles.compass} />
      </Card>
    </main>
  );
}
