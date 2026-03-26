import clsx from 'clsx';
import { useState } from 'react';

import { CodeBlock, ListBlock, MetricCard, StatusPill } from '../ui';
import {
  describeRecipe,
  getPrimitiveRecipe,
  primitiveRecipes,
  recipeUnionSnippet,
  resolveRecipeTokens,
  tokenMapSnippet,
  type PrimitiveRecipe,
  type PrimitiveRecipeId,
} from '../../lib/design-system-typing-model';

function RecipePrimitive({
  recipe,
  loading,
  onAction,
  onNavigate,
}: {
  recipe: PrimitiveRecipe;
  loading: boolean;
  onAction: () => void;
  onNavigate: (href: string) => void;
}) {
  const tokenClasses = resolveRecipeTokens(recipe);
  const className = clsx(
    'inline-flex items-center justify-center rounded-2xl border font-semibold transition',
    ...tokenClasses,
    loading && 'cursor-wait opacity-60',
  );
  const icon = recipe.icon === 'spark' ? '✦' : recipe.icon === 'arrow' ? '→' : '⛨';

  if (recipe.mode === 'link') {
    return (
      <a
        href={recipe.href}
        onClick={(event) => {
          event.preventDefault();
          onNavigate(recipe.href);
        }}
        className={className}
      >
        <span className="mr-2">{icon}</span>
        {loading ? 'Loading recipe...' : recipe.buttonLabel}
      </a>
    );
  }

  return (
    <button type="button" onClick={onAction} className={className} disabled={loading}>
      <span className="mr-2">{icon}</span>
      {loading ? 'Running recipe...' : recipe.buttonLabel}
    </button>
  );
}

export function DesignSystemTypingLab() {
  const [recipeId, setRecipeId] = useState<PrimitiveRecipeId>('publish');
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const recipe = getPrimitiveRecipe(recipeId);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {primitiveRecipes.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setRecipeId(item.id)}
            className={`chip ${recipeId === item.id ? 'chip-active' : ''}`}
          >
            {item.title}
          </button>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <div className="space-y-4 rounded-[28px] border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Active primitive recipe
              </p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">
                {recipe.title}
              </h3>
            </div>
            <StatusPill tone={recipe.mode === 'action' ? 'success' : 'warn'}>
              {recipe.mode}
            </StatusPill>
          </div>

          <p className="text-sm leading-6 text-slate-600">
            Здесь один typed recipe управляет публичным API primitive, token maps и live
            preview одновременно.
          </p>

          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <div className="flex flex-wrap items-center gap-3">
              <RecipePrimitive
                recipe={recipe}
                loading={loading}
                onAction={() =>
                  setLog((entries) => [`action:${recipe.id}`, ...entries].slice(0, 5))
                }
                onNavigate={(href) =>
                  setLog((entries) => [`navigate:${href}`, ...entries].slice(0, 5))
                }
              />
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={loading}
                  onChange={(event) => setLoading(event.currentTarget.checked)}
                />
                Simulate loading
              </label>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Current recipe string
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-900">
                {describeRecipe(recipe)}
              </p>
            </div>
          </div>

          <ListBlock
            title="Что держит typed recipe"
            items={[
              'Публичный mode компонента: action или link.',
              'Design tokens: tone, size, emphasis.',
              'Live rendering rule: button или anchor preview.',
            ]}
          />
        </div>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <MetricCard
              label="Recipe mode"
              value={recipe.mode}
              hint="Mode уже часть контракта и влияет не только на текст, но и на semantics."
              tone="accent"
            />
            <MetricCard
              label="Token pipeline"
              value={resolveRecipeTokens(recipe).join(' / ')}
              hint="Token maps держат class groups в sync с union variants."
              tone="cool"
            />
          </div>

          <MetricCard
            label="Activity log"
            value={log.length ? log.join(' | ') : 'empty'}
            hint="Лог показывает, что action и link режимы идут через разные runtime pathways."
            tone="dark"
          />

          <div className="grid gap-4 xl:grid-cols-2">
            <CodeBlock label="Recipe union" code={recipeUnionSnippet} />
            <CodeBlock label="Token map" code={tokenMapSnippet} />
          </div>
        </div>
      </div>
    </div>
  );
}
