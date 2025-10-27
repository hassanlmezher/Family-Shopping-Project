import { useEffect, useState } from 'react';
import api from '../api';

type ArchivedSummary = {
  bought: any[];
  skipped: any[];
};

export default function Archives({ goBack }: { goBack: () => void }) {
  const [lists, setLists] = useState<any[]>([]);
  const [selected, setSelected] = useState<any|null>(null);
  const [summary, setSummary] = useState<ArchivedSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.archives();
        setLists(data);
      } catch {
        setError('Failed to load archives');
      }
    })();
  }, []);

  const openDetails = async (list: any) => {
    setSelected(list);
    setLoading(true);
    setSummary(null);
    setError('');
    try {
      const { data } = await api.getArchivedItems(list.id);
      setSummary(data);
    } catch {
      setError('Failed to load archived items');
    } finally {
      setLoading(false);
    }
  };

  const closeDetails = () => {
    setSelected(null);
    setSummary(null);
    setError('');
  };

  const renderItems = (title: string, items: any[], accent: string) => (
    <div className="rounded-2xl border border-gray-200/20 dark:border-slate-200/20 bg-white/90 dark:bg-slate-900/30 p-5">
      <div className={`text-sm font-semibold uppercase tracking-wide ${accent}`}>{title} ({items.length})</div>
      {items.length === 0 ? (
        <div className="mt-4 text-sm text-gray-500 dark:text-slate-500">No items.</div>
      ) : (
        <div className="mt-4 space-y-3">
          {items.map(item => (
            <div key={item.id} className="rounded-xl border border-gray-200/20 dark:border-slate-200/20 bg-gray-50 dark:bg-slate-900/50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">{item.name}</div>
                  {item.quantity && <div className="text-xs text-gray-600 dark:text-slate-400">Qty: {item.quantity}</div>}
                </div>
                <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-slate-400">{item.status}</div>
              </div>
              {item.added_by_name && (
                <div className="mt-2 text-xs text-gray-500 dark:text-slate-500">Added by {item.added_by_name}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="rounded-3xl border border-gray-200/30 dark:border-slate-200/30 bg-white/90 dark:bg-slate-900/60 shadow-lg">
        <div className="px-6 py-5 border-b border-gray-200/20 dark:border-slate-200/20 flex items-center justify-between">
          <div>
            <div className="text-sm uppercase tracking-wide text-gray-500 dark:text-slate-400">Archives</div>
            <div className="text-2xl font-semibold text-gray-900 dark:text-white">Shopping history</div>
          </div>
          <button onClick={goBack} className="inline-flex items-center gap-2 rounded-xl border border-gray-200/30 dark:border-slate-200/30 bg-gray-100 dark:bg-slate-900/70 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-slate-200 transition hover:bg-gray-200 dark:hover:bg-slate-800">
            Back to current list
          </button>
        </div>
        <div className="p-6 space-y-6">
          {error && <div className="rounded-xl border border-rose-300/50 dark:border-rose-400/50 bg-rose-50/50 dark:bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-200">{error}</div>}

          {!selected && (
            <div className="space-y-4">
              {lists.length === 0 ? (
                <div className="rounded-2xl border border-gray-200/20 dark:border-slate-200/20 bg-gray-50 dark:bg-slate-900/40 py-12 text-center text-gray-500 dark:text-slate-400">
                  No archived lists yet. Archive a week to build your history.
                </div>
              ) : (
                lists.map(list => (
                  <div key={list.id} className="rounded-2xl border border-gray-200/30 dark:border-slate-200/30 bg-white/90 dark:bg-slate-900/50 p-6 shadow-lg transition hover:-translate-y-0.5 hover:shadow-2xl">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">{list.week_start} {'->'} {list.week_end}</div>
                        <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-slate-400">Archived shopping list</div>
                      </div>
                      <button
                        onClick={() => openDetails(list)}
                        className="mt-3 inline-flex items-center justify-center rounded-xl bg-linear-to-r from-cyan-500 via-teal-500 to-emerald-500 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-lg shadow-teal-500/30 transition hover:-translate-y-0.5 md:mt-0"
                      >
                        View details
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {selected && (
            <div className="space-y-5">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">{selected.week_start} {'->'} {selected.week_end}</div>
                  <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-slate-400">Archived shopping list summary</div>
                </div>
                <button onClick={closeDetails} className="inline-flex items-center justify-center rounded-xl border border-gray-200/30 dark:border-slate-200/30 bg-gray-100 dark:bg-slate-900/70 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-slate-200 transition hover:bg-gray-200 dark:hover:bg-slate-800">
                  Back to archives
                </button>
              </div>

              {loading && <div className="rounded-2xl border border-gray-200/20 dark:border-slate-200/20 bg-gray-50 dark:bg-slate-900/40 px-4 py-6 text-center text-gray-500 dark:text-slate-400">Loading archived items...</div>}

              {!loading && summary && (
                <div className="grid gap-5 lg:grid-cols-2">
                  {renderItems('Bought items', summary.bought, 'text-emerald-600 dark:text-emerald-300')}
                  {renderItems('Skipped items', summary.skipped, 'text-rose-600 dark:text-rose-300')}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
