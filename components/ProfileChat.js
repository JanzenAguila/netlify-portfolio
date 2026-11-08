import { useEffect, useRef, useState } from 'react';
import styles from './ProfileChat.module.css';

const starters = ['What has Janzen worked on?', 'Why did he move from RPA to software development?', 'What work opportunities interest him?'];

export default function ProfileChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const launcher = useRef(null);
  const field = useRef(null);
  const log = useRef(null);
  const request = useRef(null);

  useEffect(() => () => request.current?.abort(), []);
  useEffect(() => { if (open) field.current?.focus(); }, [open]);
  useEffect(() => { if (log.current) log.current.scrollTop = log.current.scrollHeight; }, [messages, busy, error, open]);

  function close() {
    setOpen(false);
    launcher.current?.focus();
  }

  async function send(text) {
    if (busy || !text.trim()) return;
    const history = [...messages.slice(-10), { role: 'user', content: text.trim() }];
    setBusy(true);
    setError('');
    setInput(text);
    request.current = new AbortController();
    const timeout = setTimeout(() => request.current?.abort(), 65000);
    try {
      const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: history }), signal: request.current.signal });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'The assistant is unavailable. Please try again later.');
      if (typeof result.answer !== 'string') throw new Error('The assistant could not reply. Please try again.');
      setMessages([...history, { role: 'assistant', content: result.answer }]);
      setInput('');
    } catch (failure) {
      setError(failure.name === 'AbortError' ? 'The free assistant took too long. Please try again later.' : failure.message);
    } finally {
      clearTimeout(timeout);
      setBusy(false);
    }
  }

  return (
    <aside className={styles.widget} aria-label="Janzen’s portfolio assistant">
      {open && (
        <section id="profile-chat" className={styles.panel} role="region" aria-labelledby="chat-heading" onKeyDown={event => { if (event.key === 'Escape') { event.stopPropagation(); close(); } }}>
          <header className={styles.header}>
            <div><h2 id="chat-heading">Ask about Janzen</h2><span>His work, projects, and approach to learning</span></div>
            <button type="button" onClick={close} aria-label="Close chat">×</button>
          </header>
          <p className={styles.notice}>AI assistant · May make mistakes. Messages are sent to OpenRouter. Chat history stays in this page session.</p>
          <div className={styles.messages} ref={log} role="log" aria-live="polite" aria-relevant="additions">
            {!messages.length && <><p>Hello! I’m Janzen’s portfolio assistant. What would you like to know about him?</p><div className={styles.starters}>{starters.map(text => <button key={text} type="button" disabled={busy} onClick={() => send(text)}>{text}</button>)}</div></>}
            {messages.map((message, index) => <div key={index} className={message.role === 'user' ? styles.user : styles.reply}><strong>{message.role === 'user' ? 'You' : 'Assistant'}</strong><p>{message.content}</p></div>)}
            {busy && <p role="status">Checking Janzen’s profile…</p>}
          </div>
          {error && <p className={styles.error} role="alert">{error}</p>}
          <form className={styles.form} onSubmit={event => { event.preventDefault(); send(input); }}>
            <label className={styles.label} htmlFor="chat-message">Your question about Janzen</label>
            <div className={styles.inputRow}><input id="chat-message" ref={field} value={input} maxLength={2000} onChange={event => setInput(event.target.value)} placeholder="Ask about Janzen…" autoComplete="off" /><button type="submit" disabled={busy || !input.trim()}>Send</button></div>
            <button className={styles.reset} type="button" disabled={busy || !messages.length} onClick={() => { setMessages([]); setError(''); setInput(''); field.current?.focus(); }}>Clear conversation</button>
          </form>
        </section>
      )}
      <button ref={launcher} type="button" className={styles.launcher} aria-controls="profile-chat" aria-expanded={open} onClick={() => open ? close() : setOpen(true)}>{open ? 'Close chat' : 'Ask about Janzen'}</button>
    </aside>
  );
}
