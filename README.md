# Trial SDK Development

Explore creating SDK and publishing to npm.

## 1. Project Setup

* **Initialize your project**: Create a new project with `TypeScript` and `React`:

    ```
    mkdir auth-sdk
    cd auth-sdk
    npm init -y
    npm install react react-dom typescript @types/react @types/react-dom
    ```

* **Install additional tools**: Add bundling and linting tools to help manage the SDK's build.

    ```
    npm install rollup @rollup/plugin-typescript @rollup/plugin-node-resolve rollup-plugin-peer-deps-external
    ```

## 2. Basic Directory Structure

Create a folder structure to organize your components, hooks, and utilities:

```
auth-sdk/
├── src/
│   ├── components/      # UI components (e.g., LoginForm)
│   ├── hooks/           # Hooks (e.g., useAuth)
│   ├── context/         # Context provider for global auth state
│   ├── types/           # TypeScript types and interfaces
│   └── utils/           # Utility functions (e.g., token storage)
├── index.ts             # Entry point for the SDK
├── tsconfig.json        # TS configuration
└── rollup.config.mjs    # Rollup configuration
```

## 3. Configure typescript

Set up tsconfig.json

```
{
    "compilerOptions": {
      "target": "es5",
      "module": "esnext",
      "jsx": "react-jsx",  // Use React JSX runtime
      "esModuleInterop": true,
      "allowSyntheticDefaultImports": true,
      "strict": true,
      "moduleResolution": "node",
      "resolveJsonModule": true,
      "isolatedModules": true,
      "noEmit": true,
      "lib": ["dom", "esnext"]
    },
    "include": ["src"]
}
```

## 4. Configure Rollup

* Set up Rollup to bundle your SDK for distribution:

    ```
    // rollup.config.mjs
    import typescript from '@rollup/plugin-typescript';
    import resolve from '@rollup/plugin-node-resolve';
    import peerDepsExternal from 'rollup-plugin-peer-deps-external';
    import babel from '@rollup/plugin-babel';

    export default {
        input: 'src/index.ts',
        output: {
            dir: 'dist',
            format: 'esm',
            sourcemap: true,
        },
        plugins: [
            peerDepsExternal(),
            resolve(),
            typescript({
                tsconfig: './tsconfig.json',
                jsx: 'preserve',
            }),
            babel({
                babelHelpers: 'bundled',
                presets: ['@babel/preset-react'],
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            }),
        ],
        external: ['react', 'react-dom'],
    };
    ```

* Add a `build` script to `package.json`:

    ```
    "scripts": {
        "build": "rollup -c"
    }
    ```

## 5. Build the Auth Context

Start with an authentication context for managing authentication state globally.

```
// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  user: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);

  const login = async (username: string, password: string) => {
    // Replace with actual API call and token handling logic
    setUser(username);
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
```

## 6. Build the Auth Context

This hook will simplify the API for consumers of the SDK, so they don’t have to directly interact with context.

```
// src/hooks/useAuth.ts
import { useAuth } from '../context/AuthContext';

export const useAuthAPI = () => {
  const { user, login, logout } = useAuth();

  return {
    isAuthenticated: !!user,
    user,
    login,
    logout,
  };
};
```

## 7. Build UI Components (e.g., LoginForm)

Provide a `LoginForm` component that integrates with `useAuthAPI`:

```
// src/components/LoginForm.tsx
import React, { useState } from 'react';
import { useAuthAPI } from '../hooks/useAuth';

export const LoginForm = () => {
  const { login } = useAuthAPI();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(username, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
};
```

## 8. Set Up Types and Utilities

* Add types for user data and any other interfaces in `src/types`.
* Add utility functions for handling tokens (e.g., storing and retrieving tokens from `localStorage`).

## 9. Export the SDK

In `src/index.ts`, export the main components and hooks for easy imports.

```
// src/index.ts
export { AuthProvider, useAuth } from './context/AuthContext';
export { LoginForm } from './components/LoginForm';
export { useAuthAPI } from './hooks/useAuth';
```

## 10. Document and Test

* Add documentation on how to use the `AuthProvider`, `LoginForm`, and `useAuthAPI` hook.
* Create unit tests for each component and hook, using Jest and React Testing Library.

## 11. Build and Publish

* Run `npm run build` to generate the `dist` folder.
* Publish the SDK to npm:

    ```
    npm login
    npm publish
    ```

# Example Usage in a Project

To test the SDK in a React app, wrap your app with `AuthProvider` and use the `LoginForm` component:

```
import React from 'react';
import { AuthProvider, LoginForm } from 'your-auth-sdk';

function App() {
  return (
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  );
}

export default App;
```

This should give you a solid foundation for building an authentication SDK with React and TypeScript! Let me know if you need further assistance with any part of the setup.