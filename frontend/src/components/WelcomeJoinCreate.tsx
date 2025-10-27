import { useEffect, useState } from 'react';
import api, { notifyApi } from '../api';
import { useApp } from '../store';

export default function WelcomeJoinCreate() {
  const user = useApp(s => s.user);
  const setAuth = useApp(s => s.setAuth);
  const [familyName, setFamilyName] = useState('');
  const [token, setToken] = useState('');
  const [notifications, setNotifications] = useState<Array<{ id: number; message: string; token: string; read: boolean }>>([]);

  useEffect(() => { loadNotifications(); }, []);
  async function loadNotifications() {
    try { const { data } = await notifyApi.list(); setNotifications(data); } catch {}
  }

  async function createFamily() {
    const { data } = await api.createFamily(familyName);
    setAuth({ token: data.token, user, familyId: data.family.id });
  }

  async function join() {
    const { data } = await api.joinToken(token.trim());
    setAuth({ token: data.token, user, familyId: data.familyId });
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="bg-white/90 dark:bg-slate-800/90 p-6 rounded-2xl shadow-lg border border-white/20">
        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Join a Family</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">Paste your invitation token to join your family</p>
        <input className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white mb-4" placeholder="FAM-XXXX-XXXX"
          value={token} onChange={e=>setToken(e.target.value)} />
        <button onClick={join} className="w-full p-3 rounded-xl bg-linear-to-r from-cyan-500 to-blue-500 text-white font-semibold shadow-md hover:shadow-lg transition">Join Family</button>
        {!!notifications.filter(n => n.token).length && (
          <div className="mt-6 text-sm">
            <div className="mb-2 font-semibold text-gray-900 dark:text-white">Invite Notifications</div>
            {notifications.filter(n => n.token).slice(0,2).map(n=>(
              <div key={n.id} className="flex items-center gap-2 mb-2">
                <input readOnly className="flex-1 p-2 rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white" value={n.token}/>
                <button onClick={()=>navigator.clipboard.writeText(n.token)} className="px-2 py-1 border border-gray-200 dark:border-gray-600 rounded bg-gray-100 dark:bg-slate-600 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-500 transition">Copy</button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="bg-white/90 dark:bg-slate-800/90 p-6 rounded-2xl shadow-lg border border-white/20">
        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Create Your Own Family</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">Start fresh with a new family group</p>
        <input className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white mb-4" value={familyName} onChange={e=>setFamilyName(e.target.value)} />
        <button onClick={createFamily} className="w-full p-3 rounded-xl bg-linear-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-md hover:shadow-lg transition">Create Family</button>
      </div>
    </div>
  );
}
