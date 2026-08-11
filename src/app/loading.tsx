import { NavSealHub } from "@/components/site/seals";

// Shown by the App Router during page transitions.
export default function Loading() {
  return (
    <div className="route-loader" role="status" aria-label="Loading">
      <div className="route-loader-inner">
        <span className="route-loader-seal">
          <NavSealHub />
        </span>
        <span className="route-loader-wordmark">SamsKruti</span>
        <span className="route-loader-bar" aria-hidden="true">
          <span />
        </span>
        <span className="route-loader-sub">Living Culture of India</span>
      </div>
    </div>
  );
}
