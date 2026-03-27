'use client';

import { useEffect, useState } from 'react';

import { MetricCard, Panel, StatusPill } from '../components/ui';
import { boundaryPresets } from '../lib/rsc-model';
import { compilerScenarios } from '../lib/performance-model';
import {
  finalArchitectureNarrative,
  operationalGuards,
  readinessTracks,
} from '../lib/production-polish-model';
import { routeBlueprints, selectWinningArchitecture } from '../lib/trajectory-model';
import { buildFlightLikeReport } from '../server/commerce-rsc-runtime';
import {
  renderSpaShell,
  renderSsrStorefront,
  renderStreamingStorefront,
  storefrontStreamSegments,
} from '../server/storefront-runtime';

export function PlatformPage() {
  const [transcriptRows, setTranscriptRows] = useState<string[]>([]);
  const [boundaryRows, setBoundaryRows] = useState<string[]>([]);
  const winner = selectWinningArchitecture();

  useEffect(() => {
    let cancelled = false;

    async function runRuntimeSnapshots() {
      const transcript = await renderStreamingStorefront(storefrontStreamSegments);
      const report = await buildFlightLikeReport({
        id: 'pdp',
        label: 'Карточка товара',
        layer: 'server',
        children: boundaryPresets[0].nodes.map((node) => ({
          id: node.id,
          label: node.label,
          layer: node.layer,
          asyncMs: node.asyncMs,
          clientBundleKb: node.clientBundleKb,
        })),
      });

      if (cancelled) {
        return;
      }

      setTranscriptRows(
        transcript.chunks.map(
          (chunk) => `${chunk.offsetMs}ms · ${chunk.text.slice(0, 72)}...`,
        ),
      );
      setBoundaryRows(
        report.flightRows.map(
          (row) =>
            `${row.readyAtMs}ms · ${row.layer === 'server' ? 'сервер' : 'клиент'} · ${row.label}`,
        ),
      );
    }

    void runRuntimeSnapshots();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-4">
        <MetricCard
          label="Выбранная архитектура"
          value={winner.label}
          hint="Проект использует смешанный подход осознанно, а не ради модного API."
          tone="dark"
        />
        <MetricCard
          label="Клиентский пакет чтения"
          value={`${winner.bundleKb} KB`}
          hint="Клиентский JavaScript уменьшается, потому что маршруты чтения остаются преимущественно серверными."
          tone="cool"
        />
        <MetricCard
          label="Простота мутаций"
          value={`${winner.mutationSimplicity}/100`}
          hint="Логика оформления проще, когда правила и запись данных находятся рядом."
          tone="accent"
        />
        <MetricCard
          label="Готовность HTML"
          value={`${winner.htmlReadiness}/100`}
          hint="Главная, каталог и карточка товара сразу отдают полезный HTML."
        />
      </section>

      <Panel className="space-y-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="soft-label">Платформенные решения</span>
          <p className="text-sm leading-6 text-slate-600">
            Эта страница нужна продуктовой и платформенной командам. Она объясняет, почему
            витрина по-разному рендерится на главной, в карточке товара, на оформлении и
            во внутренних маршрутах.
          </p>
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          {routeBlueprints.map((route) => (
            <div
              key={route.id}
              className="rounded-[24px] border border-slate-200 bg-white/90 p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <code className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {route.route}
                </code>
                <StatusPill tone="success">политика маршрута</StatusPill>
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-900">{route.bestFit}</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {route.whyNotSpaOnly}
              </p>
            </div>
          ))}
        </div>
      </Panel>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.85fr)]">
        <Panel className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-slate-900">Снимки выполнения</h2>
            <StatusPill tone="success">из кода проекта</StatusPill>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-900">
                Превью клиентской оболочки
              </p>
              <pre className="mt-3 overflow-x-auto text-xs leading-6 text-slate-700">
                <code>
                  {renderSpaShell({
                    title: 'Витрина StreamCart',
                    subtitle: 'Превью клиентского входного пути',
                    skuCount: 148,
                    region: 'RU',
                  }).slice(0, 180)}
                </code>
              </pre>
            </div>
            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-900">
                Превью серверной оболочки
              </p>
              <pre className="mt-3 overflow-x-auto text-xs leading-6 text-slate-700">
                <code>
                  {renderSsrStorefront({
                    title: 'Витрина StreamCart',
                    subtitle: 'Превью серверного входного пути',
                    skuCount: 148,
                    region: 'RU',
                  }).slice(0, 180)}
                </code>
              </pre>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-slate-900">Потоковая лента</p>
              <div className="mt-3 space-y-2">
                {transcriptRows.length > 0 ? (
                  transcriptRows.map((row) => (
                    <div
                      key={row}
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700"
                    >
                      {row}
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700">
                    Формируем потоковую ленту...
                  </div>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Отчёт по серверным и клиентским границам
              </p>
              <div className="mt-3 space-y-2">
                {boundaryRows.length > 0 ? (
                  boundaryRows.map((row) => (
                    <div
                      key={row}
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700"
                    >
                      {row}
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700">
                    Формируем отчёт по границам...
                  </div>
                )}
              </div>
            </div>
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900">
              Дисциплина производительности
            </h2>
            <div className="space-y-3">
              {compilerScenarios.map((scenario) => (
                <div
                  key={scenario.id}
                  className="rounded-[24px] border border-slate-200 bg-white px-4 py-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-900">
                      {scenario.label}
                    </p>
                    <StatusPill
                      tone={scenario.id === 'compiler-aware' ? 'success' : 'warn'}
                    >
                      {scenario.commitMs}ms
                    </StatusPill>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{scenario.note}</p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900">
              Готовность к продакшену
            </h2>
            <div className="space-y-3">
              {readinessTracks.map((track) => (
                <div
                  key={track.label}
                  className="rounded-[24px] border border-slate-200 bg-white px-4 py-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-900">{track.label}</p>
                    <StatusPill tone={track.score > 90 ? 'success' : 'warn'}>
                      {track.score}/100
                    </StatusPill>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{track.detail}</p>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </section>

      <Panel className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">Операционные ограничения</h2>
        <p className="text-sm leading-7 text-slate-600">{finalArchitectureNarrative}</p>
        <div className="grid gap-4 xl:grid-cols-2">
          {operationalGuards.map((guard) => (
            <div
              key={guard.title}
              className="rounded-[24px] border border-slate-200 bg-white/90 p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-lg font-semibold text-slate-900">{guard.title}</p>
                <span className="soft-label">{guard.owner}</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{guard.summary}</p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
