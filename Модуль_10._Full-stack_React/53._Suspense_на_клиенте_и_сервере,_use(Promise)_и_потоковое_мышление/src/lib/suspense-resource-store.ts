import {
  getScenePanel,
  getStudyCard,
  type ClientSceneId,
  type PanelId,
  type StudyCard,
  type StudyCardId,
  type StudySegmentId,
} from './suspense-resource-model';

const panelCache = new Map<
  string,
  Promise<{ title: string; lines: readonly string[] }>
>();
const cardBundleCache = new Map<string, Promise<StudyCard>>();
const cardSegmentCache = new Map<string, Promise<string>>();

function wait<T>(delayMs: number, value: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), delayMs);
  });
}

export function readScenePanel(
  sceneId: ClientSceneId,
  panelId: PanelId,
  revision: number,
): Promise<{ title: string; lines: readonly string[] }> {
  const key = `panel:${sceneId}:${panelId}:${revision}`;

  if (!panelCache.has(key)) {
    const panel = getScenePanel(sceneId, panelId);

    panelCache.set(
      key,
      wait(panel.delayMs, {
        title: panel.title,
        lines: panel.lines,
      }),
    );
  }

  return panelCache.get(key)!;
}

export function readStudyCardBundle(
  cardId: StudyCardId,
  revision: number,
): Promise<StudyCard> {
  const key = `card:${cardId}:${revision}`;

  if (!cardBundleCache.has(key)) {
    const card = getStudyCard(cardId);
    cardBundleCache.set(key, wait(380, card));
  }

  return cardBundleCache.get(key)!;
}

export function readStudyCardSegment(
  cardId: StudyCardId,
  segmentId: StudySegmentId,
  revision: number,
): Promise<string> {
  const key = `segment:${cardId}:${segmentId}:${revision}`;

  if (!cardSegmentCache.has(key)) {
    const card = getStudyCard(cardId);
    const delayBySegment: Record<StudySegmentId, number> = {
      summary: 180,
      client: 430,
      server: 610,
    };
    cardSegmentCache.set(key, wait(delayBySegment[segmentId], card[segmentId]));
  }

  return cardSegmentCache.get(key)!;
}

export function resetSuspenseResourceStore() {
  panelCache.clear();
  cardBundleCache.clear();
  cardSegmentCache.clear();
}
