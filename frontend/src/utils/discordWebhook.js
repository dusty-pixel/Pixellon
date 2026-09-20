/**
 * Pixellon Discord Webhook Utility
 * Handles sending rich embeds to Discord channels for free games,
 * deals, and game updates.
 */

import { formatINR } from './currency';

const STORAGE_KEY = 'pixellon_discord_webhook';

export const getWebhookUrl = () => {
  return localStorage.getItem(STORAGE_KEY) || import.meta.env.VITE_DISCORD_WEBHOOK_URL || '';
};

export const setWebhookUrl = (url) => {
  if (!url) {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY, url.trim());
  }
};

export const isWebhookConfigured = () => {
  return Boolean(getWebhookUrl());
};

/**
 * Validates whether a given string is a valid Discord webhook URL
 */
export const isValidDiscordWebhookUrl = (url) => {
  if (!url) return false;
  const discordWebhookRegex = /^https:\/\/(?:ptb\.|canary\.)?discord(?:app)?\.com\/api\/webhooks\/\d+\/[\w-]+$/i;
  return discordWebhookRegex.test(url.trim());
};

/**
 * Sends a raw Discord webhook payload
 */
export const postToDiscord = async (payload, customUrl = null) => {
  const webhookUrl = (customUrl || getWebhookUrl()).trim();
  if (!webhookUrl) {
    throw new Error('No Discord Webhook URL configured. Please add one in settings.');
  }

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'Pixellon Game Bot',
      avatar_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=256&q=80',
      ...payload,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => res.statusText);
    throw new Error(`Discord API error (${res.status}): ${errorText}`);
  }

  return true;
};

/**
 * Sends a test ping embed to verify webhook connectivity
 */
export const testDiscordWebhook = async (customUrl = null) => {
  const payload = {
    embeds: [
      {
        title: '🎮 Pixellon Game Bot Connected!',
        description: 'Your Discord channel is now connected to **Pixellon**. You will receive real-time alerts for 100% free games, massive discounts, and major gaming updates right here.',
        color: 0x2563eb, // Pixellon Brand Blue
        fields: [
          { name: '📡 Status', value: '🟢 Active & Ready', inline: true },
          { name: '🎁 Free Games Vault', value: 'Connected', inline: true },
          { name: '⚡ Source', value: '[Pixellon Gaming Hub](http://localhost:5173/)', inline: true },
        ],
        footer: {
          text: 'Pixellon Discord Radar • Webhook Verification',
          icon_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=64&q=80',
        },
        timestamp: new Date().toISOString(),
      },
    ],
  };

  return postToDiscord(payload, customUrl);
};

/**
 * Sends a single free game drop (Giveaway or F2P) to Discord
 */
export const sendFreeGameToDiscord = async (game, customUrl = null) => {
  const isGiveaway = Boolean(game.worth && game.worth !== 'N/A');
  const claimUrl = game.open_giveaway_url || game.game_url || game.freetogame_profile_url || undefined;
  const inrWorth = isGiveaway ? formatINR(game.worth) : null;
  
  const fields = [
    { name: '🎯 Genre / Type', value: game.genre || game.type || 'Game', inline: true },
    { name: '💻 Platform', value: game.platforms || game.platform || 'PC', inline: true },
  ];

  if (isGiveaway) {
    fields.push({ name: '💰 Value', value: `~~${inrWorth}~~ **FREE (-100%)**`, inline: true });
    if (game.end_date && game.end_date !== 'N/A') {
      fields.push({ name: '⏳ Ends', value: game.end_date.split(' ')[0], inline: true });
    }
  } else {
    fields.push({ name: '🏢 Publisher', value: game.publisher || game.developer || 'Free to Play', inline: true });
  }

  if (claimUrl) {
    fields.push({
      name: '🔗 Claim Free Game',
      value: `[**Click here to Claim / Play**](${claimUrl})`,
      inline: false,
    });
  }

  const payload = {
    content: isGiveaway
      ? `🚨 **WEEKLY FREE GAME DROP** • **${game.title}** is FREE (Normally **${inrWorth}**)! Claim before it expires!`
      : `🚨 **NEW FREE GAME ALERT** • **${game.title}** is 100% free right now!`,
    embeds: [
      {
        title: `🎁 ${game.title} ${isGiveaway ? `(Free • Was ${inrWorth})` : '(Free to Play)'}`,
        url: claimUrl,
        description: game.description || game.short_description || 'Check out this awesome game available for free right now!',
        color: isGiveaway ? 0xf59e0b : 0x10b981, // Amber for limited-time giveaways, Emerald for F2P
        image: (game.image || game.thumbnail) ? { url: game.image || game.thumbnail } : undefined,
        fields,
        footer: {
          text: isGiveaway ? 'Pixellon Weekly Giveaways • Limited-Time Drop' : 'Pixellon Free Games Vault • Instant Drop',
        },
        timestamp: new Date().toISOString(),
      },
    ],
  };

  return postToDiscord(payload, customUrl);
};

/**
 * Formats and sends a Game Update / News article to Discord
 */
export const sendGameUpdateToDiscord = async (newsItem, customUrl = null) => {
  const payload = {
    embeds: [
      {
        title: `📰 Game Update: ${newsItem.title || 'Breaking Gaming News'}`,
        url: newsItem.link || undefined,
        description: (newsItem.description || newsItem.content || '').replace(/<[^>]*>?/gm, '').slice(0, 300) + '...',
        color: 0x8b5cf6, // Violet
        image: newsItem.thumbnail ? { url: newsItem.thumbnail } : undefined,
        fields: [
          { name: '📅 Date', value: newsItem.pubDate || new Date().toLocaleDateString(), inline: true },
          { name: '🔗 Read Full Article', value: `[Read on Source](${newsItem.link})`, inline: true },
        ],
        footer: {
          text: 'Pixellon News & Updates',
        },
        timestamp: new Date().toISOString(),
      },
    ],
  };

  return postToDiscord(payload, customUrl);
};

/**
 * Broadcasts top free games with a short delay to respect Discord rate limits
 */
export const broadcastMultipleGames = async (games, onProgress = null) => {
  const results = [];
  for (let i = 0; i < games.length; i++) {
    const game = games[i];
    try {
      await sendFreeGameToDiscord(game);
      results.push({ success: true, title: game.title });
      if (onProgress) onProgress(i + 1, games.length, game.title);
    } catch (err) {
      results.push({ success: false, title: game.title, error: err.message });
    }
    // 600ms delay to avoid rate limiting
    if (i < games.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 600));
    }
  }
  return results;
};
