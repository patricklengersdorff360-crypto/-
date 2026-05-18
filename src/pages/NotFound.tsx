import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="text-9xl mb-8">🚧</div>
      <h1 className="text-4xl font-black mb-4">哎呀！走丢了</h1>
      <p className="text-muted-foreground mb-8">你来到了一片没有小宠物的荒野...</p>
      <Link to="/" className="btn-push">
        带我回家 🏠
      </Link>
    </div>
  );
}
