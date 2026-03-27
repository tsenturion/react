import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { authStore } from '../lib/auth-store';
import { loginRequest } from '../lib/mock-api';
import type { LoginPayload } from '../lib/types';
import { sanitizeRedirectPath } from '../lib/utils';

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('lead@sprintops.io');
  const [password, setPassword] = useState('react-ops');
  const redirectTo = sanitizeRedirectPath(searchParams.get('redirect'));

  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => loginRequest(payload),
    onSuccess(session) {
      authStore.login(session);
      void navigate(redirectTo, { replace: true });
    },
  });

  return (
    <div className="login-shell">
      <section className="login-aside">
        <p className="eyebrow">SprintOps / Auth flow</p>
        <h1>Защищённый вход в рабочую зону</h1>
        <p>
          Этот экран проверяет login mutation, loading/error states, сохранение intent и
          возврат пользователя в нужную ветку приложения после входа.
        </p>

        <div className="spotlight-card">
          <strong>Что проверять в проекте</strong>
          <ul className="plain-list">
            <li>redirect на login при попытке открыть protected route</li>
            <li>server mutation для входа и сообщение об ошибке</li>
            <li>восстановление intended path после успешной авторизации</li>
            <li>очистка приватных данных после logout</li>
          </ul>
        </div>
      </section>

      <section className="login-card">
        <div>
          <p className="panel-kicker">Demo credentials</p>
          <h2>Вход в SprintOps</h2>
          <p className="muted-copy">
            После логина роутер вернёт пользователя в <code>{redirectTo}</code>.
          </p>
        </div>

        <form
          className="form-stack"
          onSubmit={(event) => {
            event.preventDefault();
            loginMutation.mutate({ email, password });
          }}
        >
          <label className="field">
            <span>Email</span>
            <input
              className="input"
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="lead@sprintops.io"
            />
          </label>

          <label className="field">
            <span>Пароль</span>
            <input
              className="input"
              name="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="react-ops"
            />
          </label>

          {loginMutation.isError ? (
            <div className="error-state" role="alert">
              <div>
                <h3>Войти не удалось</h3>
                <p>{loginMutation.error.message}</p>
              </div>
            </div>
          ) : null}

          <button
            type="submit"
            className="button button--full"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending
              ? 'Проверяем доступ...'
              : 'Войти и открыть dashboard'}
          </button>
        </form>

        <div className="credentials-grid">
          <article className="mini-card">
            <strong>Lead</strong>
            <code>lead@sprintops.io</code>
            <code>react-ops</code>
          </article>
          <article className="mini-card">
            <strong>Operator</strong>
            <code>ops@sprintops.io</code>
            <code>react-ops</code>
          </article>
        </div>
      </section>
    </div>
  );
}
