import Image, { StaticImageData } from "next/image";
import styles from "./Users.module.scss";
import { actions, useDispatch, useSelector } from "@/store";
import Plus from "@/public/icons/plus.svg";
import { useRouter } from "next/navigation";
import tmdb from "@/util/tmdb";
import avatarImage from "@/public/default-avatar/1.png";

type Props = { isOpen: boolean };

export default function SwitchUser({ isOpen }: Props) {
  const router = useRouter();
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users);
  const otherUsers = users.users.filter(
    (i) => i.session.id !== users.user?.session.id
  );

  const avatars = otherUsers.map((i) => {
    let avatar: StaticImageData | string = avatarImage;
    if (i.avatar?.gravatar.hash) {
      avatar = `https://gravatar.com/avatar/${i.avatar.gravatar.hash}?s=45`;
      if (i.avatar.tmdb.avatar_path) {
        avatar += `?d=${encodeURIComponent(
          `https://image.tmdb.org/t/p/w45${i.avatar.tmdb.avatar_path}`
        )}`;
      }
    }
    return avatar;
  });

  function softLogout() {
    dispatch(actions.users.softLogout());
    authenticate();
  }

  function hardLogout() {
    dispatch(actions.users.hardLogout());
    router.replace("/");
  }

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
    <dialog
      open={isOpen}
      className={`${styles.users} ${isOpen ? styles.open : ""}`}>
      <div>
        {otherUsers.map((user, index) => (
          <button
            key={user.session.id}
            onClick={() => dispatch(actions.users.switchUser(user))}>
            <Image
              src={avatars[index]!}
              alt={user.username!}
              width={45}
              height={45}
            />
            {user.username || "Guest"}
          </button>
        ))}
        <button onClick={softLogout}>
          <div className={styles.addProfile}>
            <Plus />
          </div>
          Crear perfil
        </button>
        <div className={styles.controls}>
          <button>Editar perfis</button>
          <button>Preferências</button>
          <button>Minha assinatura</button>
          <button>Minha conta</button>
          <button>Ajuda</button>
          <button onClick={hardLogout}>Sair</button>
        </div>
      </div>
    </dialog>
  );
}
