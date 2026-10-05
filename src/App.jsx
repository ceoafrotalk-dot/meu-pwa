import { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import { signInAnonymously } from 'firebase/auth';
import { collection, addDoc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';

function App() {
  const [posts, setPosts] = useState([]);
  const [texto, setTexto] = useState('');
  const [user, setUser] = useState(null);

  // 1. Login anônimo automático
  useEffect(() => {
    signInAnonymously(auth).then((cred) => {
      setUser(cred.user);
    });
  }, []);

  // 2. Ouvir posts em tempo real
  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("criadoEm", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  // 3. Postar
  const postar = async () => {
    if (!texto.trim()) return;
    await addDoc(collection(db, "posts"), {
      texto: texto,
      autor: "CEO Afrotalk",
      uid: user?.uid,
      criadoEm: serverTimestamp(),
      likes: 0
    });
    setTexto('');
  };

  return (
    <div style={{background:'#0a0a0a', color:'white', minHeight:'100vh', padding:'20px', fontFamily:'sans-serif'}}>
      <h1 style={{color:'#f59e0b', textAlign:'center'}}>🔥 AfroTalk</h1>
      <p style={{textAlign:'center', color:'#aaa'}}>Conectando a quebrada - SALVANDO NO FIREBASE</p>

      <div style={{maxWidth:'500px', margin:'20px auto', display:'flex', gap:'10px'}}>
        <input 
          value={texto}
          onChange={e => setTexto(e.target.value)}
          placeholder="O que tá pegando, CEO?"
          style={{flex:1, padding:'15px', borderRadius:'10px', border:'none', background:'#1a1a1a', color:'white'}}
        />
        <button onClick={postar} style={{padding:'15px 25px', background:'#f59e0b', border:'none', borderRadius:'10px', fontWeight:'bold'}}>
          Postar
        </button>
      </div>

      <div style={{maxWidth:'500px', margin:'0 auto'}}>
        {posts.length === 0 && <p style={{textAlign:'center', color:'#555'}}>Nenhum post ainda. Seja o primeiro!</p>}
        {posts.map(p => (
          <div key={p.id} style={{background:'#1a1a1a', padding:'15px', borderRadius:'12px', marginBottom:'10px', border:'1px solid #333'}}>
            <p>{p.texto}</p>
            <small style={{color:'#888'}}>{p.autor}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;