import Link from "next/link";

export default function StoreNotFound() {
  return (
    <div className="plain">
      <h1>That page is not in the store</h1>
      <p>
        <Link href="/">Back to the App Store</Link>
      </p>
    </div>
  );
}
