import { getWikidataGame } from './wikidata';
import { getGameDeals } from './deals';
import { getTopStreams, getLivePlayers } from './api';
import { buildVaultRecord } from './vaultRecord';

const FALLBACK_ART =
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80';

/**
 * Build a full Vault page record for Wikidata-sourced games
 * (ids like `wd-Q123`, produced by Vault search fallback).
 */
export async function loadWikidataVaultPage(gameId) {
  const qid = String(gameId).replace(/^wd-/, '');
  const wd = await getWikidataGame(qid);
  if (!wd?.title) return null;

  const [deals, streams, live] = await Promise.all([
    getGameDeals(wd.title),
    getTopStreams(wd.title),
    wd.steamAppId ? getLivePlayers(wd.steamAppId) : null,
  ]);

  const infoData = [
    { label: 'Developer', value: wd.developers.join(', ') || 'Unknown' },
    { label: 'Publisher', value: wd.publishers.join(', ') || 'Unknown' },
    { label: 'Release Date', value: wd.releaseDate || 'TBA' },
    { label: 'Genre', value: wd.genres.join(', ') || wd.description || 'Video game' },
  ];
  if (wd.platforms.length) infoData.push({ label: 'Platforms', value: wd.platforms.join(', ') });
  if (wd.series.length) infoData.push({ label: 'Series', value: wd.series.join(', ') });
  if (wd.steamAppId) infoData.push({ label: 'Steam App ID', value: String(wd.steamAppId) });
  if (live) infoData.push({ label: 'Steam Players Live', value: `${live.players.toLocaleString()} online` });
  if (wd.website) infoData.push({ label: 'Website', value: wd.website, type: 'link' });
  infoData.push({ label: 'Wikidata', value: wd.wikidataUrl, type: 'link' });
  infoData.push({ label: 'Record Source', value: 'Wikidata (CC0) + open feeds' });

  const overview = [
    '# Overview',
    '',
    wd.description ? `*${wd.description} — via Wikidata (CC0).*` : '',
    '',
    wd.developers.length ? `Developed by **${wd.developers.join(', ')}**.` : '',
    wd.releaseDate ? `Released **${wd.releaseDate}**.` : '',
  ]
    .filter((l) => l !== '')
    .join('\n');

  return {
    id: gameId,
    title: wd.title,
    banner: FALLBACK_ART,
    infoboxImage: FALLBACK_ART,
    infoboxData: infoData,
    igdbData: null,
    twitchStreams: streams,
    deals,
    record: buildVaultRecord({ wikidata: wd, steamAppId: wd.steamAppId, deals, streams }),
    pages: { home: { title: 'Overview', content: overview } },
  };
}
