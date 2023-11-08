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
  const { values, actions, helpers } = useLogin();

  useEffect(() => {
    if (values.user) {
      router.push("/home");
    } else {
      if (searchParams["request_token"]) {
        dispatch(actions.login(searchParams["request_token"] as string));
      }
    }
  }, [actions, dispatch, router, searchParams, values.user]);

  return (
    <main className={styles.main}>
      <Card className={styles.card}>
        <h1>Compass Video</h1>
        <p className={styles.subtitle}>
          Acesse sua conta para ver nossos títulos
        </p>
        <button className={styles.button} onClick={helpers.auth}>
          Iniciar sessão com TMDB
        </button>
        <p className={styles.guest}>
          Não tem conta?{" "}
          <button onClick={() => dispatch(actions.loginAsGuest())}>
            Acesse como convidado
          </button>
        </p>
        <Image src={compass} alt="Compass Logo" className={styles.compass} />
      </Card>
    </main>
  );
}
