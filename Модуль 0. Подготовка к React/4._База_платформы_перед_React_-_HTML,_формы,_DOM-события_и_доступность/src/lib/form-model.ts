export type MessageMode = 'enabled' | 'readonly' | 'disabled';

export type PlatformFormConfig = {
  trackHasName: boolean;
  messageMode: MessageMode;
  requireConsent: boolean;
};

export const messageModes: MessageMode[] = ['enabled', 'readonly', 'disabled'];

export const describeFormBehavior = (config: PlatformFormConfig) => {
  const fieldRules = [
    '`name` определяет, попадёт ли control в FormData.',
    config.messageMode === 'disabled'
      ? '`textarea` отключён: браузер не сериализует disabled-поля.'
      : config.messageMode === 'readonly'
        ? '`textarea` readonly: редактирование закрыто, но значение всё ещё сериализуется.'
        : '`textarea` активен и сериализуется как обычное поле.',
    config.requireConsent
      ? 'Чекбокс согласия обязателен: браузер не пропустит submit без отметки.'
      : 'Согласие не обязательно: submit пройдёт и без отметки.',
  ];

  const omissions = [
    ...(!config.trackHasName
      ? ['Select визуально есть, но без `name` браузер не положит его в FormData.']
      : []),
    ...(config.messageMode === 'disabled'
      ? ['Disabled-поле выглядит на экране, но отсутствует в payload формы.']
      : []),
  ];

  const markupPreview = `<form>
  <label for="email">Email</label>
  <input id="email" name="email" type="email" required />

  <label for="track">Трек</label>
  <select id="track"${config.trackHasName ? ' name="track"' : ''}>...</select>

  <label for="message">Комментарий</label>
  <textarea id="message" name="message"${config.messageMode === 'readonly' ? ' readonly' : ''}${config.messageMode === 'disabled' ? ' disabled' : ''}></textarea>

  <input id="consent" name="consent" type="checkbox"${config.requireConsent ? ' required' : ''} />
</form>`;

  return {
    fieldRules,
    omissions,
    markupPreview,
  };
};

export const summarizeSubmittedEntries = (
  entries: [string, FormDataEntryValue][],
  config: PlatformFormConfig,
) => {
  const fields = entries.map(([name, value]) => `${name}: ${String(value)}`);
  const omitted = [
    ...(!config.trackHasName ? ['track: отсутствует, потому что у select нет name'] : []),
    ...(config.messageMode === 'disabled'
      ? ['message: отсутствует, потому что поле disabled']
      : []),
  ];

  return {
    fieldCount: fields.length,
    fields,
    omitted,
  };
};
