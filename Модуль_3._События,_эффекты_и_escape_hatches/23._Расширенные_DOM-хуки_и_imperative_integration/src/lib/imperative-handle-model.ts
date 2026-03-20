export function buildImperativeHandleReport(kind: 'api' | 'ownership' | 'focus') {
  if (kind === 'api') {
    return {
      title: 'Expose narrow API',
      summary:
        'useImperativeHandle полезен, когда наружу нужно вынести не DOM-узел целиком, а ограниченный набор команд.',
      snippet: [
        'useImperativeHandle(ref, () => ({',
        '  open: () => setIsOpen(true),',
        '  reset: resetPanel,',
        '}), [resetPanel]);',
      ].join('\n'),
    };
  }

  if (kind === 'ownership') {
    return {
      title: 'Child owns internal state',
      summary:
        'Родитель не должен мутировать внутренние данные child-компонента напрямую. Handle даёт только договорённые команды.',
      snippet: [
        'type PaletteHandle = {',
        '  open(prefill?: string): void;',
        '  focusSearch(): void;',
        '};',
      ].join('\n'),
    };
  }

  return {
    title: 'Focus after open',
    summary:
      'Imperative команда может открыть child, а затем перевести focus уже внутри него после commit текущего DOM.',
    snippet: [
      'pendingFocusRef.current = true;',
      'setIsOpen(true);',
      '',
      'useLayoutEffect(() => {',
      '  if (isOpen && pendingFocusRef.current) inputRef.current?.focus();',
      '}, [isOpen]);',
    ].join('\n'),
  };
}
