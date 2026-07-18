"use client";
import Link from "next/link";
import { useSellerConversations } from "./use-seller-conversations";

export function SellerDashboardClient({ productCount }: { productCount: number }) {
  const { conversations, loaded } = useSellerConversations();
  const unread = conversations.reduce((total, message) => total + message.unread, 0);
  const channelCount = (channel: string) => conversations.filter((message) => message.channel === channel).reduce((total, message) => total + message.unread, 0);
  return <section className="seller-content">
    <div className="seller-hero-card"><div><p className="seller-kicker">Seller overview</p><h2>{unread ? "Customer inquiries need attention." : "Your workspace is ready."}</h2><p>{unread ? `${unread} unread customer ${unread === 1 ? "message" : "messages"}.` : "No customer inquiries have been added or connected yet."}</p></div><Link href="/seller/inbox" className="seller-primary">{unread ? "Open unified inbox" : "Add an inquiry"} <span>→</span></Link></div>
    <div className="seller-metrics">
      {(["Instagram", "WhatsApp", "Facebook"] as const).map((channel) => <article key={channel}><span className={`metric-icon ${channel.toLowerCase()}`}>{channel === "Facebook" ? "f" : channel === "Instagram" ? "◎" : "◉"}</span><div><small>{channel}</small><strong>{loaded ? channelCount(channel) : "—"}</strong><p>{channelCount(channel) ? "Unread messages" : "Not connected"}</p></div></article>)}
      <article><span className="metric-icon listing">◇</span><div><small>Active listings</small><strong>{productCount}</strong><p>Published catalog records</p></div></article>
    </div>
    <div className="seller-columns">
      <section className="seller-panel"><div className="panel-heading"><div><p className="seller-kicker">Customer inquiries</p><h2>{conversations.length ? "Messages to reply" : "No inquiries yet"}</h2></div><Link href="/seller/inbox">{conversations.length ? "View all" : "Add inquiry"}</Link></div>
        {conversations.length ? <div className="message-list">{conversations.slice(0, 3).map((message) => <Link href={`/seller/inbox?conversation=${message.id}`} className="message-row" key={message.id}><span className={`channel-dot ${message.channel.toLowerCase()}`}>{message.channel[0]}</span><div><strong>{message.customer}</strong><p>{message.preview}</p><small>{message.channel} · {message.age}</small></div><b>{message.unread}</b></Link>)}</div> : <div className="seller-empty-state"><span>✦</span><p>Add a genuine customer inquiry manually. Connected social channels can be added when provider credentials are available.</p><Link href="/seller/inbox" className="seller-primary">Add first inquiry</Link></div>}
      </section>
      <aside className="seller-panel quick-panel"><p className="seller-kicker">Quick action</p><h2>List a new piece</h2><p>Capture the piece, describe it naturally, and let VAIDHURYA Assist structure the details.</p><Link href="/seller/listings/new" className="capture-button"><span>＋</span><strong>Add listing</strong><small>Photos, video & AI assistance</small></Link><div className="catalog-note"><strong>{productCount} live catalog records</strong><Link href="/seller/listings">Manage listings →</Link></div></aside>
    </div>
  </section>;
}
