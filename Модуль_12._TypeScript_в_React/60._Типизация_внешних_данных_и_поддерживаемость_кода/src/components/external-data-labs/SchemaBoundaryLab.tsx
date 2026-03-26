import { useMemo, useState } from 'react';

import { CodeBlock, ListBlock, MetricCard, StatusPill } from '../ui';
import {
  boundarySnippet,
  describeUnsafePreview,
  getSchemaPayload,
  schemaPayloads,
  schemaSnippet,
  summarizeSchemaIssues,
  validateReviewItem,
  type SchemaPayloadId,
} from '../../lib/zod-schema-boundary-model';

export function SchemaBoundaryLab() {
  const [payloadId, setPayloadId] = useState<SchemaPayloadId>('valid');
  const payload = getSchemaPayload(payloadId);
  const result = useMemo(() => validateReviewItem(payload.data), [payload]);
  const issues = result.success ? [] : summarizeSchemaIssues(result.error);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {schemaPayloads.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setPayloadId(item.id)}
            className={`chip ${payloadId === item.id ? 'chip-active' : ''}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <MetricCard
          label="Выбранный payload"
          value={payload.label}
          hint={payload.note}
          tone="accent"
        />
        <MetricCard
          label="Unsafe preview"
          value={describeUnsafePreview(payload.data)}
          hint="Так выглядит ситуация, если приложение просто кастует payload и идёт дальше."
          tone="cool"
        />
        <MetricCard
          label="Schema result"
          value={result.success ? 'valid' : 'schema error'}
          hint={
            result.success
              ? 'Схема подтвердила contract, и после этого тип действительно заслужен.'
              : 'Schema mismatch остановлен до попадания в остальной React-код.'
          }
          tone={result.success ? 'default' : 'dark'}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="panel-dark p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Raw payload
            </p>
            <StatusPill tone={result.success ? 'success' : 'error'}>
              {result.success ? 'safeParse success' : 'safeParse failed'}
            </StatusPill>
          </div>
          <pre className="overflow-x-auto text-sm leading-6 text-slate-100">
            <code>{JSON.stringify(payload.data, null, 2)}</code>
          </pre>
        </div>

        <div className="space-y-4">
          {result.success ? (
            <div className="rounded-[24px] border border-emerald-300/50 bg-emerald-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                Parsed entity
              </p>
              <p className="mt-3 text-sm leading-6 text-emerald-950">
                {result.data.title} · {result.data.owner} · {result.data.stage}
              </p>
              <p className="mt-2 text-sm leading-6 text-emerald-900">
                Score {result.data.score} / tags {result.data.tags.join(', ')}
              </p>
            </div>
          ) : (
            <ListBlock title="Schema issues" items={issues} />
          )}

          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Почему это важно
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              Даже если UI “знает” тип сущности, реальный payload сначала должен пройти
              через runtime proof. Иначе вы получаете красивую типовую подсказку поверх
              недоказанных данных.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <CodeBlock label="Schema" code={schemaSnippet} />
        <CodeBlock label="Boundary parse" code={boundarySnippet} />
      </div>
    </div>
  );
}
