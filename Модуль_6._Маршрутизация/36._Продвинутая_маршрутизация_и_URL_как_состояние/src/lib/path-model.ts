import type { RouteTreeNode } from './routing-domain';

export function splitPathname(pathname: string) {
  return pathname.split('/').filter(Boolean);
}

export function getMatchedTreePaths(node: RouteTreeNode, pathname: string): string[] {
  const matched: string[] = [];

  function visit(current: RouteTreeNode) {
    const normalized =
      current.path === '/' ? '/' : current.path.replace(/\/:([^/]+)/g, '');

    const isMatch =
      normalized === '/'
        ? pathname === '/' || pathname.startsWith('/')
        : pathname === normalized || pathname.startsWith(`${normalized}/`);

    if (!isMatch) {
      return;
    }

    matched.push(current.id);
    current.children?.forEach(visit);
  }

  visit(node);
  return matched;
}
