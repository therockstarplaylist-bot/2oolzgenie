import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "The 2oolzgenie apps do not collect personal data. World Launcher reads the on-device app list and contacts two public websites.",
};

export default function PrivacyPage() {
  return (
    <div className="plain">
      <h1>Privacy Policy</h1>
      <p>Last updated November 19, 2026.</p>
      <p>
        The 2oolzgenie App Store and the apps on it are made by Brandon. You can download them
        without an account. This page is the privacy policy for those apps. Its address ends in{" "}
        <code>/privacy</code>.
      </p>
      <h2>Personal data</h2>
      <p>
        These apps do not collect personal data. They do not ask for your name, email, contacts,
        photos, or location, and they do not include ads or tracking.
      </p>
      <h2>World Launcher</h2>
      <p>
        World Launcher reads the list of apps installed on your phone so each app can be a building
        in the town. That list stays on your phone. It is not sent to this website.
      </p>
      <p>It also contacts two public websites to see if they are up:</p>
      <ul className="bullets">
        <li>https://2oolzgenie.vercel.app</li>
        <li>https://brandon-game-lab.vercel.app</li>
      </ul>
      <p>
        A building in the town can also ask GitHub&apos;s public API whether the 2oolzgenie project
        has a new commit. Those requests do not include information about you.
      </p>
      <h2>Deep Dive, Big Drop, and Game Lab</h2>
      <p>These games run on your phone. They do not send personal data anywhere.</p>
      <h2>PhoneBridge</h2>
      <p>
        PhoneBridge sends the files and folders you choose from your Android phone to your Windows
        PC over your home Wi-Fi. The transfer stays between those two devices. It does not upload
        your files to this website.
      </p>
      <h2>This website</h2>
      <p>
        The store pages are files and pictures. Downloading an app does not require an account.
        The older 2oolz Genie lamp on this site is separate. If you sign in there with Google, that
        sign-in is only for the lamp, not for these downloads.
      </p>
      <p>
        <Link href="/">Back to the App Store</Link>
      </p>
    </div>
  );
}
