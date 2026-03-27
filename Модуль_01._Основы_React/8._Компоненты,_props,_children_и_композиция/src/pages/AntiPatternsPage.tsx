import { PropPitfallsSandbox } from '../components/composition/PropPitfallsSandbox';
import {
  BeforeAfter,
  CodeBlock,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { getProjectStudy } from '../lib/project-study';

const mutationSnippet = [
  'function MutatingTagsBad({ tags }) {',
  '  return (',
  '    <button onClick={() => {',
  '      tags.push("mutated");',
  '      forceRerender();',
  '    }}>',
  '      Плохое добавление',
  '    </button>',
  '  );',
  '}',
].join('\n');

const mirrorSnippet = [
  'function BrokenMirrorField({ title }) {',
  '  const [draft, setDraft] = useState(title);',
  '  return <input value={draft} onChange={(e) => setDraft(e.target.value)} />;',
  '}',
].join('\n');

export function AntiPatternsPage() {
  const study = getProjectStudy('anti-patterns');

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 6"
        title="Типичные ошибки при проектировании компонентов"
        copy="Самые неприятные проблемы часто появляются не в разметке, а в контракте компонента. Мутация props, зеркалирование props в state и попытки «исправить» компонент изнутри размывают поток данных и ломают предсказуемость."
      />

      <PropPitfallsSandbox />

      <BeforeAfter
        beforeTitle="Компонент вмешивается в чужие данные"
        before="Дочерний компонент мутирует массив, копирует props в локальный state или пытается жить по своей версии данных. Поведение становится скрытым и нестабильным."
        afterTitle="Компонент остаётся честным"
        after="Компонент читает props, а изменение данных происходит через callback и новое значение state в родителе. Поток данных остаётся явным и предсказуемым."
      />

      <div className="grid gap-4 xl:grid-cols-2">
        <CodeBlock label="Мутация props/state" code={mutationSnippet} />
        <CodeBlock label="Зеркало props в state" code={mirrorSnippet} />
      </div>

      <Panel className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Файлы и листинги проекта</h2>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
