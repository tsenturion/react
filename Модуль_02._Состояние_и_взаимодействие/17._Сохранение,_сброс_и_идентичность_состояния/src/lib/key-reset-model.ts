import type { StatusTone } from './learning-model';

export type KeyResetReport = {
  tone: StatusTone;
  title: string;
  summary: string;
  risk: string;
  snippet: string;
};

export function buildKeyResetReport(useKey: boolean): KeyResetReport {
  if (useKey) {
    return {
      tone: 'success',
      title: 'Key задаёт новый экземпляр',
      summary:
        'Изменение key заставляет React считать поддерево новым и заново инициализировать локальный state.',
      risk: 'Это полезно для осознанного reset формы или черновика, но разрушит несохранённые данные, если reset не планировался.',
      snippet: [
        '<RecipientComposer',
        '  key={activeProfile.id}',
        '  profile={activeProfile}',
        '/>',
      ].join('\n'),
    };
  }

  return {
    tone: 'warn',
    title: 'Без key остаётся один экземпляр',
    summary:
      'React переиспользует тот же component instance, поэтому локальный draft и счётчики переходят к другой сущности.',
    risk: 'Так незаметно появляется “чужой” state: письмо новому получателю открывается со старым черновиком.',
    snippet: ['<RecipientComposer', '  profile={activeProfile}', '/>'].join('\n'),
  };
}
