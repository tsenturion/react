import { Link, useLocation } from 'react-router-dom';

import {
  BeforeAfter,
  ListBlock,
  MetricCard,
  Panel,
  ProjectStudy,
  SectionIntro,
} from '../components/ui';
import { projectStudies } from '../lib/project-study';

export function SpaPage() {
  const location = useLocation();
  const study = projectStudies.spa;

  return (
    <div className="space-y-8">
      <SectionIntro
        eyebrow="Лаборатория 5"
        title="Как роутинг меняет ментальную модель SPA"
        copy="После появления маршрутов приложение начинает делиться не только на компоненты, но и на экраны, адреса и пользовательские сценарии. URL становится частью архитектуры, а не просто транспортом для хэша."
      />

      <Panel className="space-y-6">
        <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-700">
          Сейчас вы находитесь на экране <strong>{location.pathname}</strong>. Перейдите,
          например, к{' '}
          <Link
            to="/params/catalog-archive"
            className="font-semibold text-blue-700 underline decoration-blue-300 underline-offset-4"
          >
            архивному param-route
          </Link>{' '}
          или обратно к{' '}
          <Link
            to="/client-routing"
            className="font-semibold text-blue-700 underline decoration-blue-300 underline-offset-4"
          >
            базовой навигации
          </Link>
          . Shell вокруг экрана останется тем же, но сам сценарий URL и содержимое экрана
          изменятся.
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <ListBlock
            title="Компоненты"
            items={[
              'Nav, header, footer и локальные UI-фрагменты.',
              'Переиспользуемые карточки, кнопки и панели.',
              'Смысл компонента локален относительно дерева UI.',
            ]}
          />
          <ListBlock
            title="Экраны"
            items={[
              'Маршруты вроде /client-routing, /navigation или /params/:lessonId.',
              'Каждый экран имеет собственный URL и точку входа.',
              'Экран определяется не только компонентом, но и адресом.',
            ]}
          />
          <ListBlock
            title="Сценарии"
            items={[
              'Открыть ссылку из новой вкладки.',
              'Вернуться через back/forward.',
              'Поделиться адресом конкретной сущности.',
            ]}
          />
        </div>
      </Panel>

      <BeforeAfter
        beforeTitle="Без роутинга"
        before="Приложение выглядит как один экран с множеством локальных переключателей. URL почти ничего не говорит о текущем состоянии."
        afterTitle="С роутингом"
        after="Экран, адрес, история браузера и пользовательский сценарий образуют единый слой. Это уже не просто компонентный tree, а screen architecture."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="URL"
          value="Part of state"
          hint="Адрес перестаёт быть внешним атрибутом и становится частью пользовательского состояния."
          tone="cool"
        />
        <MetricCard
          label="Screens"
          value="Beyond components"
          hint="Появляется уровень экранов и сценариев поверх обычного tree компонентов."
        />
        <MetricCard
          label="History"
          value="User expectation"
          hint="Back/forward и открытие ссылки начинают влиять на архитектуру экрана заранее."
          tone="accent"
        />
      </div>

      <Panel>
        <ProjectStudy files={study.files} snippets={study.snippets} />
      </Panel>
    </div>
  );
}
