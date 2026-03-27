export type Channel = 'team' | 'beta' | 'public';
export type DeliveryMode = 'success' | 'failure';
export type FeedEntryState = 'sending' | 'confirmed';

export type AnnouncementPayload = {
  title: string;
  summary: string;
  channel: Channel;
  note: string;
};

export type DispatchReceipt = {
  headline: string;
  detail: string;
  channelLabel: string;
  ticket: string;
};

export type FeedEntry = {
  id: string;
  title: string;
  summary: string;
  channel: Channel;
  channelLabel: string;
  state: FeedEntryState;
};

export const channelOptions: readonly { value: Channel; label: string }[] = [
  { value: 'team', label: 'Team only' },
  { value: 'beta', label: 'Beta users' },
  { value: 'public', label: 'Public release' },
] as const;

export const deliveryModeOptions: readonly {
  value: DeliveryMode;
  label: string;
  hint: string;
}[] = [
  {
    value: 'success',
    label: 'Server confirms',
    hint: 'Итог действия подтверждается сервером и становится частью базового состояния.',
  },
  {
    value: 'failure',
    label: 'Server rejects',
    hint: 'Форма показывает ошибку, а optimistic overlay откатывается к подтверждённой сервером версии.',
  },
] as const;

export const initialFeedEntries: readonly FeedEntry[] = [
  {
    id: 'entry-alpha',
    title: 'Release checklist updated',
    summary: 'Команда синхронизировала шаги перед публикацией React 19 формы.',
    channel: 'team',
    channelLabel: 'Team only',
    state: 'confirmed',
  },
  {
    id: 'entry-beta',
    title: 'Beta sign-up note',
    summary: 'Для бета-пула включён отдельный сценарий наблюдения за pending submit.',
    channel: 'beta',
    channelLabel: 'Beta users',
    state: 'confirmed',
  },
] as const;

function normalizeChannel(value: string): Channel {
  if (value === 'beta' || value === 'public') {
    return value;
  }

  return 'team';
}

export function formatChannel(channel: Channel) {
  return channelOptions.find((item) => item.value === channel)?.label ?? 'Team only';
}

// Здесь payload читается прямо из FormData, потому что lesson 50 посвящён
// именно новой модели форм: источник данных — submit формы, а не копия всех
// полей в отдельном controlled-state слое вокруг action.
export function readAnnouncementPayload(formData: FormData): AnnouncementPayload {
  return {
    title: String(formData.get('title') ?? '').trim(),
    summary: String(formData.get('summary') ?? '').trim(),
    channel: normalizeChannel(String(formData.get('channel') ?? 'team')),
    note: String(formData.get('note') ?? '').trim(),
  };
}

export function validateAnnouncementPayload(payload: AnnouncementPayload) {
  const issues: string[] = [];

  if (payload.title.length < 4) {
    issues.push(
      'Добавьте заголовок минимум из 4 символов, чтобы результат submit был различим.',
    );
  }

  if (payload.summary.length < 12) {
    issues.push(
      'Сделайте summary длиннее 12 символов, иначе optimistic UI мало что объясняет.',
    );
  }

  if (payload.channel === 'public' && payload.note.length < 12) {
    issues.push(
      'Для public release нужна заметка минимум из 12 символов: внешний канал требует более явного контекста.',
    );
  }

  return issues;
}

export function buildReceipt(payload: AnnouncementPayload): DispatchReceipt {
  const channelLabel = formatChannel(payload.channel);
  const ticket = `${payload.channel.toUpperCase()}-${payload.title
    .replace(/[^a-zA-Z0-9а-яА-Я]+/g, '')
    .slice(0, 6)
    .toUpperCase()}`;

  return {
    headline: `${payload.title} подтверждено`,
    detail: `Сервер подтвердил отправку для канала ${channelLabel.toLowerCase()}.`,
    channelLabel,
    ticket,
  };
}

// `sending` — это намеренно не серверная истина, а локальная optimistic-overlay
// версия записи. Отдельный state помогает визуально различать подтверждённые
// данные и мгновенную реакцию интерфейса до ответа сервера.
export function buildFeedEntry(
  payload: AnnouncementPayload,
  state: FeedEntryState,
): FeedEntry {
  return {
    id: `${state}-${crypto.randomUUID()}`,
    title: payload.title,
    summary: payload.summary,
    channel: payload.channel,
    channelLabel: formatChannel(payload.channel),
    state,
  };
}

export function delay(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}
