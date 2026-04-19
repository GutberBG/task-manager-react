import "./Footer.css";

type FooterProps = {
  total: number;
  pending: number;
};

function Footer({ total, pending }: FooterProps) {
  return (
    <p>
      {pending} pendientes / {total} total
    </p>
  );
}

export default Footer;