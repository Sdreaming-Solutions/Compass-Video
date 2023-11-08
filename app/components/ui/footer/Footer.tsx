import styles from './Footer.module.scss';

export default function Footer() {
  return (
    <footer className={styles.footerSite}>
      <img className={styles.logoFooter} src="/compass.png" alt="Logo Compass Uol" />
      <nav className={styles.navFooter}>
        <a href="#">Política de privacidade</a>
        <a href="#">Acuerdo de suscripción</a>
        <a href="#">Ayuda</a>
        <a href="#">Dispositivos compatible</a>
        <a href="#">Acerca de Disney+</a>
        <a href="#">Publicidad personalizada</a>
      </nav>
      <p className={styles.footerDisney}>
        Disney+ es un servicio por suscripción de pago, su contenido está sujeto
        a disponibilidad. El servicio Disney+ es comercializado por Disney DTC
        LATAM, Inc., 2400 W Alameda AVE., Burbank CA 91521.
      </p>
      <p className={styles.footerDisney}>
        &copy; Disney. Todos los derechos reservados.
      </p>
    </footer>
  );
}
