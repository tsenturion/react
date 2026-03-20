import { Children, Fragment, isValidElement, type ReactNode } from 'react';

export type InspectedNode =
  | { kind: 'text'; label: string }
  | {
      kind: 'element';
      typeName: string;
      props: { key: string; value: string }[];
      children: InspectedNode[];
    };

const formatPropValue = (value: unknown) => {
  if (typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (typeof value === 'function') return '[fn]';
  if (Array.isArray(value)) return `[${value.length} items]`;
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'object') return '{…}';
  return String(value);
};

const getTypeName = (type: unknown) => {
  if (type === Fragment) return 'Fragment';
  if (typeof type === 'string') return type;
  if (typeof type === 'function') {
    const component = type as { displayName?: string; name?: string };
    return component.displayName ?? component.name ?? 'Anonymous';
  }
  return 'Unknown';
};

// Инспектор работает не с DOM, а с теми React elements,
// которые создаются JSX или `createElement(...)` до реального рендера в браузер.
export function inspectReactNode(node: ReactNode): InspectedNode[] {
  if (node === null || node === undefined || typeof node === 'boolean') {
    return [];
  }

  if (typeof node === 'string' || typeof node === 'number') {
    return [{ kind: 'text', label: JSON.stringify(String(node)) }];
  }

  if (Array.isArray(node)) {
    return node.flatMap((item) => inspectReactNode(item));
  }

  if (isValidElement<Record<string, unknown>>(node)) {
    const { children, ...restProps } = node.props ?? {};

    return [
      {
        kind: 'element',
        typeName: getTypeName(node.type),
        props: Object.entries(restProps).map(([key, value]) => ({
          key,
          value: formatPropValue(value),
        })),
        children: Children.toArray(children as ReactNode).flatMap((child) =>
          inspectReactNode(child),
        ),
      },
    ];
  }

  return [{ kind: 'text', label: '[unsupported node]' }];
}

export function summarizeInspectedTree(nodes: readonly InspectedNode[]) {
  let elementCount = 0;
  let textCount = 0;
  let maxDepth = 0;

  const visit = (node: InspectedNode, depth: number) => {
    maxDepth = Math.max(maxDepth, depth);

    if (node.kind === 'text') {
      textCount += 1;
      return;
    }

    elementCount += 1;
    node.children.forEach((child) => visit(child, depth + 1));
  };

  nodes.forEach((node) => visit(node, 1));

  return { elementCount, textCount, maxDepth };
}

const renderNode = (node: InspectedNode, depth: number): string[] => {
  const indent = '  '.repeat(depth);

  if (node.kind === 'text') {
    return [`${indent}${node.label}`];
  }

  const propsPart =
    node.props.length > 0
      ? ` ${node.props.map((item) => `${item.key}=${item.value}`).join(' ')}`
      : '';

  const lines = [`${indent}<${node.typeName}${propsPart}>`];
  node.children.forEach((child) => {
    lines.push(...renderNode(child, depth + 1));
  });
  return lines;
};

export function formatInspectedTree(nodes: readonly InspectedNode[]) {
  return nodes.flatMap((node) => renderNode(node, 0)).join('\n');
}
