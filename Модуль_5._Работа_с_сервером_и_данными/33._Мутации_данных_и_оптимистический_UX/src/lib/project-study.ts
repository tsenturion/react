import type { LabId } from './learning-model';

type ProjectStudyEntry = {
  files: readonly { path: string; note: string }[];
  snippets: readonly { label: string; note: string; code: string }[];
};

export const projectStudies: Record<LabId, ProjectStudyEntry> = {
  flow: {
    files: [
      {
        path: 'src/components/mutations/MutationFlowLab.tsx',
        note: 'Полный optimistic flow: действие, локальный patch, pending badge и server confirmation.',
      },
      {
        path: 'src/lib/mutation-client.ts',
        note: 'Fake server с задержкой и явным подтверждением мутации после transport delay.',
      },
      {
        path: 'src/lib/mutation-state-model.ts',
        note: 'Чистые state transitions, которые меняют список без привязки к UI.',
      },
    ],
    snippets: [
      {
        label: 'MutationFlowLab.tsx',
        note: 'Лаборатория сначала меняет UI локально, а уже потом дожидается подтверждения сервера.',
        code: `const optimisticItems = markPending(
  toggleDone(cloneItems(viewItems), id),
  id,
  'Ожидает подтверждение сервера',
);

setViewItems(optimisticItems);`,
      },
      {
        label: 'mutation-client.ts',
        note: 'Даже в учебном fake server ответ приходит отдельно и позже, чтобы optimistic patch был виден как отдельная фаза.',
        code: `await wait(delayMs);

return {
  item: { ...item, done: !item.done },
  note: 'Сервер подтвердил переключение статуса.',
};`,
      },
    ],
  },
  optimistic: {
    files: [
      {
        path: 'src/components/mutations/OptimisticComparisonLab.tsx',
        note: 'Две панели на одном и том же запросе: optimistic UX и ожидание server confirmation.',
      },
      {
        path: 'src/components/mutations/MutationBoardView.tsx',
        note: 'Общий UI-компонент списка, чтобы разница была именно в data flow, а не в разной разметке.',
      },
      {
        path: 'src/lib/mutation-domain.ts',
        note: 'Общая доменная модель одной и той же mutation-сущности для обеих стратегий.',
      },
    ],
    snippets: [
      {
        label: 'OptimisticComparisonLab.tsx',
        note: 'Optimistic и conservative flow отличаются не сервером, а моментом, когда UI разрешает себе измениться.',
        code: `if (strategy === 'optimistic') {
  workingItems = markPending(
    toggleDone(workingItems, id),
    id,
    'UI уже показывает ожидаемый итог',
  );
  setViewItems(workingItems);
}`,
      },
      {
        label: 'MutationBoardView.tsx',
        note: 'Один и тот же визуальный слой показывает обычные, pending и temporary элементы без отдельной бизнес-логики внутри разметки.',
        code: `{item.pending ? (
  <span className="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-semibold text-amber-800">
    {item.pendingLabel}
  </span>
) : null}`,
      },
    ],
  },
  rollback: {
    files: [
      {
        path: 'src/components/mutations/RollbackLab.tsx',
        note: 'Лаборатория с выбором success/fail и обязательным откатом optimistic patch.',
      },
      {
        path: 'src/lib/mutation-state-model.ts',
        note: 'Pure helpers для snapshot-копии, optimistic toggle и возврата к подтверждённой версии.',
      },
      {
        path: 'src/lib/mutation-client.ts',
        note: 'MutationRequestError специально отделяет транспортную неудачу от успешного server confirm.',
      },
    ],
    snippets: [
      {
        label: 'RollbackLab.tsx',
        note: 'Rollback строится вокруг snapshot, а не вокруг попытки догадаться, как восстановить UI постфактум.',
        code: `const snapshot = cloneItems(viewItems);
const optimisticItems = markPending(
  toggleDone(snapshot, id),
  id,
  'Ожидает сервер',
);`,
      },
      {
        label: 'RollbackLab.tsx',
        note: 'Если сервер отклонил мутацию, интерфейс возвращается к последнему подтверждённому состоянию.',
        code: `} catch (error) {
  setViewItems(snapshot);
  setMessage(
    error instanceof MutationRequestError
      ? error.message
      : 'Неизвестная ошибка мутации.',
  );
}`,
      },
    ],
  },
  confirmation: {
    files: [
      {
        path: 'src/components/mutations/ConfirmationGapLab.tsx',
        note: 'Показывает разницу между локально отображённым заголовком и значением, которое вернул сервер.',
      },
      {
        path: 'src/lib/mutation-client.ts',
        note: 'Server canonicalization нормализует строку и тем самым меняет optimistic ожидание.',
      },
      {
        path: 'src/lib/mutation-state-model.ts',
        note: 'Переименование и pending-маркировка вынесены в чистые функции, чтобы отделить state transitions от сетевого слоя.',
      },
    ],
    snippets: [
      {
        label: 'ConfirmationGapLab.tsx',
        note: 'UI сначала показывает локальный ввод, а затем заменяет его на server-confirmed вариант.',
        code: `const optimisticItems = markPending(
  renameItem(cloneItems(viewItems), confirmedItem.id, title),
  confirmedItem.id,
  'Локально показано до ответа сервера',
);`,
      },
      {
        label: 'mutation-client.ts',
        note: 'Сервер вправе вернуть не ровно тот текст, который уже отобразился в optimistic UI.',
        code: `const confirmedTitle =
  outcome === 'canonicalize' ? normalizeServerTitle(nextTitle) : nextTitle.trim();`,
      },
    ],
  },
  list: {
    files: [
      {
        path: 'src/components/mutations/ListConsistencyLab.tsx',
        note: 'Optimistic add/delete с temp id, server replacement и rollback удаления.',
      },
      {
        path: 'src/lib/mutation-state-model.ts',
        note: 'Здесь живут prepend, remove и replaceTempItem для структурных изменений списка.',
      },
      {
        path: 'src/lib/mutation-client.ts',
        note: 'Fake server выдаёт постоянный id после create и может отклонить delete.',
      },
    ],
    snippets: [
      {
        label: 'ListConsistencyLab.tsx',
        note: 'Temp id существует только для мгновенного optimistic рендера новой записи.',
        code: `const tempId = 'temp-' + Date.now();
const tempItem = buildTempItem(tempId, title, 'release');
const optimisticItems = prependItem(cloneItems(viewItems), tempItem);

setViewItems(optimisticItems);`,
      },
      {
        label: 'mutation-state-model.ts',
        note: 'После server confirm временная запись обязана уступить место подтверждённой сущности сервера.',
        code: `export function replaceTempItem(
  items: readonly MutationViewItem[],
  tempId: string,
  nextItem: MutationCatalogItem,
) {
  return items.map((item) =>
    item.id === tempId ? { ...nextItem, pending: false, temp: false } : item,
  );
}`,
      },
    ],
  },
  architecture: {
    files: [
      {
        path: 'src/lib/mutation-ux-model.ts',
        note: 'Pure advisor, который подбирает optimistic, hybrid или conservative flow по свойствам операции.',
      },
      {
        path: 'src/components/mutations/MutationArchitectureLab.tsx',
        note: 'Интерактивная оболочка над advisor-моделью с переключением risk и reversibility.',
      },
      {
        path: 'src/App.tsx',
        note: 'Даже общий shell урока закрепляет тему через глобальные линзы speed/trust и server truth.',
      },
    ],
    snippets: [
      {
        label: 'mutation-ux-model.ts',
        note: 'Архитектурное решение здесь вынесено в pure function, чтобы trade-offs были читаемыми и тестируемыми.',
        code: `if (inputs.highRisk || (inputs.destructive && !inputs.reversible)) {
  return {
    approach: 'Conservative UX',
    score: 90,
  };
}`,
      },
      {
        label: 'MutationArchitectureLab.tsx',
        note: 'Лаборатория не просто перечисляет правила, а даёт живо менять свойства операции и видеть смену рекомендованной стратегии.',
        code: `const recommendation = recommendMutationUx({
  reversible,
  destructive,
  serverCanonicalizes,
  instantFeedbackMatters,
  highRisk,
});`,
      },
    ],
  },
};
