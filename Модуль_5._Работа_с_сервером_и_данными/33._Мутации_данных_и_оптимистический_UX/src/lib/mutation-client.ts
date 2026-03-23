import type { MutationCatalogItem, MutationOutcome } from './mutation-domain';

let serverCounter = 40;

export class MutationRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MutationRequestError';
  }
}

async function wait(delayMs: number) {
  await new Promise<void>((resolve) => {
    window.setTimeout(resolve, delayMs);
  });
}

export function normalizeServerTitle(title: string) {
  return title
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/^[a-zа-яё]/, (char) => char.toUpperCase());
}

export async function mutateToggleOnServer(
  item: MutationCatalogItem,
  outcome: MutationOutcome,
  delayMs: number,
) {
  await wait(delayMs);

  if (outcome === 'fail') {
    throw new MutationRequestError(
      'Сервер не смог подтвердить изменение. Интерфейс должен откатить optimistic patch.',
    );
  }

  return {
    item: { ...item, done: !item.done },
    note: 'Сервер подтвердил переключение статуса.',
  };
}

export async function mutateRenameOnServer(
  item: MutationCatalogItem,
  nextTitle: string,
  outcome: MutationOutcome,
  delayMs: number,
) {
  await wait(delayMs);

  if (outcome === 'fail') {
    throw new MutationRequestError(
      'Сервер отклонил новое название. Локально показанное значение нельзя считать подтверждённым.',
    );
  }

  const confirmedTitle =
    outcome === 'canonicalize' ? normalizeServerTitle(nextTitle) : nextTitle.trim();

  return {
    item: { ...item, title: confirmedTitle },
    note:
      outcome === 'canonicalize'
        ? 'Сервер сохранил нормализованную версию значения.'
        : 'Сервер подтвердил новое значение без изменений.',
  };
}

export async function mutateCreateOnServer(
  title: string,
  lane: MutationCatalogItem['lane'],
  outcome: MutationOutcome,
  delayMs: number,
) {
  await wait(delayMs);

  if (outcome === 'fail') {
    throw new MutationRequestError(
      'Сервер не создал элемент. Временная карточка должна исчезнуть из списка.',
    );
  }

  serverCounter += 1;

  return {
    item: {
      id: `server-${serverCounter}`,
      title: outcome === 'canonicalize' ? normalizeServerTitle(title) : title.trim(),
      lane,
      done: false,
      owner: 'Сервер',
    } satisfies MutationCatalogItem,
    note: 'Сервер присвоил постоянный id и вернул подтверждённую запись.',
  };
}

export async function mutateDeleteOnServer(
  item: MutationCatalogItem,
  outcome: MutationOutcome,
  delayMs: number,
) {
  await wait(delayMs);

  if (outcome === 'fail') {
    throw new MutationRequestError(
      'Сервер не подтвердил удаление. Интерфейс должен вернуть запись обратно.',
    );
  }

  return {
    removedId: item.id,
    note: 'Сервер подтвердил удаление записи.',
  };
}
