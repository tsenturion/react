export function buildDialogBridgeReport(kind: 'state' | 'forced' | 'cleanup') {
  if (kind === 'state') {
    return {
      title: 'Bridge state to dialog API',
      summary:
        'React хранит isOpen, а effect synchronizes это состояние с showModal() и close() нативного dialog.',
      snippet: [
        'useEffect(() => {',
        '  if (isOpen && !dialog.open) dialog.showModal();',
        '  if (!isOpen && dialog.open) dialog.close();',
        '}, [isOpen]);',
      ].join('\n'),
    };
  }

  if (kind === 'forced') {
    return {
      title: 'Imperative drift',
      summary:
        'Если вызвать showModal() напрямую и не обновить React state, интерфейс начнёт жить в двух версиях истины.',
      snippet: [
        'dialogRef.current?.showModal();',
        '// но badge и кнопки React ещё считают, что dialog закрыт',
      ].join('\n'),
    };
  }

  return {
    title: 'Cleanup and close sync',
    summary:
      'Когда dialog закрывается руками пользователя, bridge должен вернуть React state обратно в closed.',
    snippet: [
      'dialog.addEventListener("close", handleClose);',
      'return () => dialog.removeEventListener("close", handleClose);',
    ].join('\n'),
  };
}
