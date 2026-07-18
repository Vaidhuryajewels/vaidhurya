"use client";
import { useState } from "react";
import { SellerShell } from "@/components/seller-shell";
import { useSellerConversations } from "@/components/use-seller-conversations";
import type { SellerConversation } from "@/lib/seller-data";

const blankInquiry = { customer: "", channel: "WhatsApp" as SellerConversation["channel"], handle: "", preview: "", priority: "Normal" as SellerConversation["priority"] };

export default function InboxPage() {
  const { conversations, loaded, save } = useSellerConversations();
  const [activeId, setActiveId] = useState("");
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState(blankInquiry);
  const active = conversations.find((message) => message.id === activeId) ?? conversations[0];
  function addInquiry(event: React.FormEvent) {
    event.preventDefault();
    const inquiry: SellerConversation = { ...draft, id: crypto.randomUUID(), age: "Just now", unread: 1 };
    save([inquiry, ...conversations]); setActiveId(inquiry.id); setDraft(blankInquiry); setAdding(false);
  }
  function resolveActive() {
    if (!active) return;
    save(conversations.map((message) => message.id === active.id ? { ...message, unread: 0 } : message));
  }
  return <SellerShell eyebrow="Customer care" title="Unified inbox"><section className="seller-content inbox-layout">
    <aside className="inbox-list"><div className="inbox-list-heading"><div><strong>Real inquiries</strong><small>{conversations.length} saved</small></div><button className="seller-primary" onClick={() => setAdding(true)}>＋ Add inquiry</button></div>
      {!loaded ? <p className="inbox-loading">Loading inquiries…</p> : conversations.length ? conversations.map((message) => <button onClick={() => setActiveId(message.id)} className={`message-row ${active?.id === message.id ? "selected" : ""}`} key={message.id}><span className={`channel-dot ${message.channel.toLowerCase()}`}>{message.channel[0]}</span><div><strong>{message.customer}</strong><p>{message.preview}</p><small>{message.channel} · {message.age}</small></div>{message.unread ? <b>{message.unread}</b> : null}</button>) : <div className="inbox-empty"><span>✦</span><h2>No customer inquiries</h2><p>Social channels are not connected. Add a genuine inquiry received elsewhere to start tracking it here.</p><button className="seller-primary" onClick={() => setAdding(true)}>Add first inquiry</button></div>}
    </aside>
    <article className="conversation-panel">{active ? <><header><div className={`channel-dot ${active.channel.toLowerCase()}`}>{active.channel[0]}</div><div><h2>{active.customer}</h2><p>{active.handle || "No contact handle"} · {active.channel}</p></div><button onClick={resolveActive}>Mark resolved</button></header><div className="conversation-body"><p className="date-divider">Saved inquiry</p><div className="chat-bubble customer">{active.preview}<small>{active.age}</small></div></div><div className="connection-notice"><strong>{active.channel} sending is not connected</strong><p>Replies are disabled until the business channel provider is configured. This app will not claim a message was delivered when it was not.</p></div></> : <div className="conversation-empty"><span>◇</span><h2>Select or add an inquiry</h2><p>Only seller-entered or provider-synced customer data will appear here.</p></div>}</article>
    {adding ? <div className="profile-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setAdding(false); }}><section className="profile-modal inquiry-modal" role="dialog" aria-modal="true" aria-labelledby="inquiry-title"><header><div><p className="seller-kicker">Real customer data</p><h2 id="inquiry-title">Add inquiry</h2></div><button onClick={() => setAdding(false)} aria-label="Close inquiry form">×</button></header><form onSubmit={addInquiry}><label>Customer name<input required value={draft.customer} onChange={(event) => setDraft({ ...draft, customer: event.target.value })} /></label><label>Channel<select value={draft.channel} onChange={(event) => setDraft({ ...draft, channel: event.target.value as SellerConversation["channel"] })}><option>WhatsApp</option><option>Instagram</option><option>Facebook</option></select></label><label>Phone, handle or profile<input value={draft.handle} onChange={(event) => setDraft({ ...draft, handle: event.target.value })} /></label><label>Customer message<textarea required value={draft.preview} onChange={(event) => setDraft({ ...draft, preview: event.target.value })} /></label><label>Priority<select value={draft.priority} onChange={(event) => setDraft({ ...draft, priority: event.target.value as SellerConversation["priority"] })}><option>Normal</option><option>High</option></select></label><button className="seller-primary" type="submit">Save inquiry</button></form></section></div> : null}
  </section></SellerShell>;
}
