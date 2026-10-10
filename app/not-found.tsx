import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap page-title">
      <p className="kicker">404</p>
      <h1>Такой страницы нет</h1>
      <p className="lede">Проверьте адрес или откройте каталог.</p>
      <div className="actions">
        <Link className="btn" href="/catalog">Каталог</Link>
        <Link className="btn light" href="/">На главную</Link>
      </div>
    </div>
  );
}
