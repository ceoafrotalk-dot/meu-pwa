import { useState, useEffect, useRef } from "react";

export default function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("afrotalk_user") || "null"));
  const [form, setForm] = useState({ nome: "", contato: "", idade: "", genero: "", pais: "" });
  const [aba, setAba] = useState("home");
  const [chatAberto, setChatAberto] = useState(null);
  const [posts, setPosts] = useState([{ id: 1, user: "Ana", texto: "Bem-vindo ao AfroTalk! 🔥", likes: 12, liked: false, comentarios: ["Top!"] }]);
  const [stories, setStories] = useState([{ id: 1, user: "Ana", visto: false, time: Date.now() },{ id: 2, user: "João", visto: false, time: Date.now() }]);
  const [storyAtivo, setStoryAtivo] = useState(null);
  const [showCriar, setShowCriar] = useState(false);
  const [textoPost, setTextoPost] = useState("");
  const [arquivoPost, setArquivoPost] = useState(null);
  const [comentInput, setComentInput] = useState({});
  const [paraSolicitar, setParaSolicitar] = useState([{ id: 1, nome: "Ana Silva" }, { id: 2, nome: "João Pedro" }]);
  const [recebidas, setRecebidas] = useState([{ id: 10, nome: "Carlos" }]);
  const [amigos, setAmigos] = useState([{ id: 20, nome: "Mia", online: true, visto: "online agora" },{ id: 21, nome: "Samuel", online: false, visto: "visto hoje às 14:20" }]);
  const [mensagens, setMensagens] = useState({ 20: [], 21: [] });
  const [textoChat, setTextoChat] = useState("");
  const [gravando, setGravando] = useState(false);
  const recorderRef = useRef(null);
  const [notifs, setNotifs] = useState([{ id: 1, texto: "Ana curtiu seu post ❤️", lida: false, hora: "agora" },{ id: 2, texto: "Carlos aceitou sua solicitação ✅", lida: false, hora: "5min" },{ id: 3, texto: "Tens nova mensagem de Mia 💬", lida: false, hora: "10min" },{ id: 4, texto: "Nova função: Chat com áudio liberada! ⚙️", lida: true, hora: "1h" }]);
  const [editPerfil, setEditPerfil] = useState(false);
  const [bio, setBio] = useState("Criador do AfroTalk 🔥");

  useEffect(() => {
    const i = setInterval(() => setStories(s => s.filter(st => Date.now() - st.time < 86400000)), 60000);
    return () => clearInterval(i);
  }, []);

  const login = () => {
    if (!form.nome ||!form.contato ||!form.idade ||!form.genero ||!form.pais) return alert("Preencha tudo!");
    localStorage.setItem("afrotalk_user", JSON.stringify(form));
    setUser(form);
  };

  if (!user) return (
    <div style={{ maxWidth: 380, margin: "40px auto", padding: 20, fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center", color: "#FF6A00" }}>AfroTalk</h1>
      <input placeholder="Nome completo" style={inp} value={form.nome} onChange={e => setForm({...form, nome: e.target.value })} />
      <input placeholder="Número ou Email" style={inp} value={form.contato} onChange={e => setForm({...form, contato: e.target.value })} />
      <input type="number" placeholder="Idade actual" style={inp} value={form.idade} onChange={e => setForm({...form, idade: e.target.value })} />
      <select style={inp} value={form.genero} onChange={e => setForm({...form, genero: e.target.value })}><option value="">Género</option><option>Masculino</option><option>Feminino</option></select>
      <select style={inp} value={form.pais} onChange={e => setForm({...form, pais: e.target.value })}><option value="">País</option><option>Moçambique</option><option>Angola</option><option>Brasil</option><option>Portugal</option><option>África do Sul</option></select>
      <button onClick={login} style={btnLaranja}>Entrar no AfroTalk</button>
    </div>
  );

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", fontFamily: "Arial", background: "#fff", minHeight: "100vh", paddingBottom: 70 }}>
      <div style={{ display: "flex", justifyContent: "space-between", padding: 12, borderBottom: "1px solid #eee", position: "sticky", top: 0, background: "white", zIndex: 10 }}>
        <h2 style={{ margin: 0, color: "#FF6A00" }}>Afrotalk</h2>
        <div style={{ display: "flex", gap: 12 }}><button onClick={() => setShowCriar(true)} style={ico}>➕</button><button style={ico}>🔍</button></div>
      </div>

      {aba === "home" && (
        <>
          <div style={{ display: "flex", gap: 12, padding: 12, overflowX: "auto", borderBottom: "1px solid #eee" }}>
            {stories.map(st => (
              <div key={st.id} onClick={() => { setStoryAtivo(st); setStories(stories.map(s => s.id === st.id? {...s, visto: true } : s)); setTimeout(() => setStoryAtivo(null), 5000); }} style={{ textAlign: "center", cursor: "pointer" }}>
                <div style={{ width: 60, height: 60, borderRadius: 50, border: st.visto? "3px solid #ccc" : "3px solid #FFD700", background: "#eee", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>{st.user[0]}</div>
                <small>{st.user}</small>
              </div>
            ))}
          </div>
          {storyAtivo && <div onClick={() => setStoryAtivo(null)} style={{ position: "fixed", inset: 0, background: "black", color: "white", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}><h2>{storyAtivo.user}</h2><p>Story some em 24h</p></div>}
          {posts.map(p => (
            <div key={p.id} style={{ width: 512, maxWidth: "100%", margin: "10px auto", border: "1px solid #eee", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ padding: 10, fontWeight: "bold" }}>{p.user}</div>
              <div style={{ width: 512, maxWidth: "100%", height: 512, background: "#fafafa", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, textAlign: "center" }}>{p.texto} {p.arquivo && <><br />📎 {p.arquivo}</>}</div>
              <div style={{ padding: 10, display: "flex", gap: 15 }}><button onClick={() => { setPosts(posts.map(x => x.id === p.id? {...x, liked:!x.liked, likes: x.liked? x.likes - 1 : x.likes + 1 } : x)); }} style={ico}>{p.liked? "❤️" : "🤍"} {p.likes}</button><button style={ico}>💬 {p.comentarios.length}</button><button style={ico}>↗️</button></div>
              <div style={{ padding: "0 10px 10px" }}>{p.comentarios.map((c, i) => <div key={i} style={{ fontSize: 13 }}>💬 {c}</div>)}<div style={{ display: "flex", gap: 5, marginTop: 6 }}><input value={comentInput[p.id] || ""} onChange={e => setComentInput({...comentInput, [p.id]: e.target.value })} placeholder="Comentar..." style={{ flex: 1, padding: 6, borderRadius: 20, border: "1px solid #ddd" }} /><button onClick={() => { if (!comentInput[p.id]) return; setPosts(posts.map(x => x.id === p.id? {...x, comentarios: [...x.comentarios, comentInput[p.id]] } : x)); setComentInput({...comentInput, [p.id]: "" }); }}>Enviar</button></div></div>
            </div>
          ))}
        </>
      )}

      {aba === "solicitacoes" && (
        <div style={{ padding: 15 }}>
          <h3>👥 Pessoas pra solicitar</h3>
          {paraSolicitar.map(p => <div key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #eee" }}><b>{p.nome}</b>{p.enviado? <span>Enviada ✅</span> : <button onClick={() => setParaSolicitar(paraSolicitar.map(x => x.id === p.id? {...x, enviado: true } : x))} style={btnMini}>Solicitar</button>}</div>)}
          <h3 style={{ marginTop: 20 }}>📩 Recebidas</h3>
          {recebidas.map(r => <div key={r.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0" }}><b>{r.nome}</b><div style={{ display: "flex", gap: 6 }}><button onClick={() => { setAmigos([...amigos, { id: r.id, nome: r.nome, online: true, visto: "online agora" }]); setRecebidas(recebidas.filter(x => x.id!== r.id)); }} style={btnMiniAzul}>Aceitar</button><button onClick={() => setRecebidas(recebidas.filter(x => x.id!== r.id))} style={btnMiniCinza}>Recusar</button></div></div>)}
        </div>
      )}

      {aba === "chat" &&!chatAberto && (
        <div>
          <h3 style={{ padding: 15 }}>💬 Chat</h3>
          {amigos.map(a => <div key={a.id} onClick={() => setChatAberto(a)} style={{ display: "flex", gap: 10, padding: 12, borderBottom: "1px solid #eee", cursor: "pointer" }}><div style={{ width: 45, height: 45, borderRadius: 50, background: "#FF6A00", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>{a.nome[0]}</div><div><b>{a.nome}</b><div style={{ fontSize: 11, color: a.online? "green" : "gray" }}>{a.online? "Online" : a.visto}</div></div></div>)}
        </div>
      )}

      {aba === "chat" && chatAberto && (
        <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 120px)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: 10, borderBottom: "1px solid #eee" }}><button onClick={() => setChatAberto(null)}>←</button><b>{chatAberto.nome}</b><small style={{ color: chatAberto.online? "green" : "gray", marginLeft: 6 }}>{chatAberto.online? "Online agora" : chatAberto.visto}</small></div>
          <div style={{ flex: 1, overflowY: "auto", padding: 10, background: "#e5ddd5" }}>{(mensagens[chatAberto.id] || []).map(m => <div key={m.id} style={{ background: m.de === "Você"? "#dcf8c6" : "white", padding: 8, borderRadius: 10, margin: "6px 0", maxWidth: "75%", marginLeft: m.de === "Você"? "auto" : 0 }}>{m.texto}<div style={{ fontSize: 9, textAlign: "right" }}>{m.hora}</div></div>)}</div>
          <div style={{ display: "flex", gap: 6, padding: 10, borderTop: "1px solid #eee" }}>
            <label style={{ fontSize: 20, cursor: "pointer" }}>📎<input type="file" hidden onChange={e => { const f = e.target.files[0]; if (!f) return; setMensagens({...mensagens, [chatAberto.id]: [...(mensagens[chatAberto.id] || []), { id: Date.now(), texto: `📎 ${f.name}`, de: "Você", hora: new Date().toLocaleTimeString().slice(0, 5) }] }); }} /></label>
            <input value={textoChat} onChange={e => setTextoChat(e.target.value)} placeholder="Escrever texto..." style={{ flex: 1, padding: "8px 12px", borderRadius: 20, border: "1px solid #ddd" }} />
            <button onClick={() => { if (!textoChat.trim()) return; setMensagens({...mensagens, [chatAberto.id]: [...(mensagens[chatAberto.id] || []), { id: Date.now(), texto: textoChat, de: "Você", hora: new Date().toLocaleTimeString().slice(0, 5) }] }); setTextoChat(""); }} style={{ border: "none", background: "#FF6A00", color: "white", borderRadius: 50, width: 36, height: 36 }}>➤</button>
          </div>
        </div>
      )}

      {aba === "notificacoes" && (<div>{notifs.map(n => <div key={n.id} style={{ padding: 12, borderBottom: "1px solid #eee", background: n.lida? "white" : "#eef6ff" }}><div style={{ fontSize: 14, fontWeight: n.lida? 400 : 700 }}>{n.texto}</div><small style={{ color: "gray" }}>{n.hora}</small></div>)}</div>)}
      {aba === "definicoes" && (
        <div style={{ padding: 15 }}>
          <div style={{ textAlign: "center" }}><div style={{ width: 80, height: 80, borderRadius: 50, background: "#FF6A00", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, margin: "0 auto" }}>{user.nome[0]}</div><h3>{user.nome}</h3><p style={{ fontSize: 13, color: "gray" }}>{bio}</p><p>👥 {amigos.length} amigos • 📝 {posts.length} postes</p><button onClick={() => setEditPerfil(true)} style={btnMini}>Editar perfil</button></div>
          <div style={{ marginTop: 15 }}><div style={linha}>👥 Convidar amigos</div><div style={linha}>💬 Apoio AfroTalk</div><div style={linha}>🔒 Política de privacidade</div><div style={linha}>ℹ️ Sobre AfroTalk</div><div style={{...linha, color: "red" }} onClick={() => { localStorage.clear(); location.reload(); }}>🚪 Sair</div></div>
          {editPerfil && <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}><div style={{ background: "white", padding: 20, borderRadius: 12, width: 340 }}><h3>Editar perfil</h3><textarea value={bio} onChange={e => setBio(e.target.value)} style={{ width: "100%", height: 70, padding: 8 }} /><button onClick={() => setEditPerfil(false)} style={btnLaranja}>Salvar</button></div></div>}
        </div>
      )}

      {showCriar && <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ background: "white", width: 380, maxWidth: "90%", padding: 20, borderRadius: 12 }}><h3>Criar publicação</h3><textarea value={textoPost} onChange={e => setTextoPost(e.target.value)} placeholder="O que está a pensar?" style={{ width: "100%", height: 90, padding: 10 }} /><label style={{ display: "block", marginTop: 10, border: "1px dashed #ccc", padding: 8, borderRadius: 8, cursor: "pointer" }}>📎 arquivos<input type="file" hidden onChange={e => setArquivoPost(e.target.files[0])} /></label>{arquivoPost && <small>📁 {arquivoPost.name}</small>}<button onClick={() => { if (!textoPost.trim()) return; setPosts([{ id: Date.now(), user: user.nome, texto: textoPost, arquivo: arquivoPost?.name, likes: 0, liked: false, comentarios: [] },...posts]); setTextoPost(""); setArquivoPost(null); setShowCriar(false); }} style={btnLaranja}>Publicar</button><button onClick={() => setShowCriar(false)} style={{...btnLaranja, background: "#eee", color: "black", marginTop: 6 }}>Cancelar</button></div></div>}

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, maxWidth: 520, margin: "0 auto", display: "flex", justifyContent: "space-around", background: "white", borderTop: "1px solid #eee", padding: "8px 0" }}>
        <button onClick={() => { setAba("home"); setChatAberto(null); }} style={navBtn(aba === "home")}>🏠 Home</button>
        <button onClick={() => { setAba("solicitacoes"); setChatAberto(null); }} style={navBtn(aba === "solicitacoes")}>👥 Soli</button>
        <button onClick={() => setAba("chat")} style={navBtn(aba === "chat")}>💬 Chat</button>
        <button onClick={() => { setAba("notificacoes"); setChatAberto(null); }} style={navBtn(aba === "notificacoes")}>🔔 Noti</button>
        <button onClick={() => { setAba("definicoes"); setChatAberto(null); }} style={navBtn(aba === "definicoes")}>⚙️ Def</button>
      </div>
    </div>
  );
}
const inp = { width: "100%", padding: 12, margin: "6px 0", borderRadius: 8, border: "1px solid #ccc" };
const btnLaranja = { width: "100%", padding: 12, background: "#FF6A00", color: "white", border: "none", borderRadius: 8, fontWeight: "bold", marginTop: 10, cursor: "pointer" };
const ico = { border: "none", background: "none", fontSize: 20, cursor: "pointer" };
const btnMini = { padding: "6px 12px", background: "#FF6A00", color: "white", border: "none", borderRadius: 6, fontWeight: "bold" };
const btnMiniAzul = { padding: "6px 12px", background: "#1877F2", color: "white", border: "none", borderRadius: 6, fontWeight: "bold" };
const btnMiniCinza = { padding: "6px 12px", background: "#eee", border: "none", borderRadius: 6 };
const linha = { padding: "14px 0", borderBottom: "1px solid #eee", cursor: "pointer" };
const navBtn = (ativo) => ({ border: "none", background: "none", fontSize: 12, fontWeight: ativo? "bold" : 400, color: ativo? "#FF6A00" : "black", cursor: "pointer" });