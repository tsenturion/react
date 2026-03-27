export const historicalLegacyContextSnippet = `class LegacyProvider extends React.Component {
  static childContextTypes = {
    theme: PropTypes.string,
  };

  getChildContext() {
    return { theme: this.props.theme };
  }

  render() {
    return this.props.children;
  }
}

class LegacyConsumer extends React.Component {
  static contextTypes = {
    theme: PropTypes.string,
  };

  render() {
    return <span>{this.context.theme}</span>;
  }
}`;

export const historicalContextWarnings = [
  'Значение context становилось менее явным и хуже отслеживалось по дереву.',
  'Типизация и поддержка были заметно сложнее, чем у современного createContext API.',
  'Для нового кода этот подход не нужен, но читать его в legacy-проектах всё ещё приходится.',
] as const;
