## 1. Clean Form Defaults & Remove Demo Credentials

- [x] 1.1 In `components/auth/AuthGate.tsx`, initialize `usernameInput` and `passwordInput` to empty strings `""`
- [x] 1.2 Remove the "Temporary Demo Credentials" notification card entirely from `components/auth/AuthGate.tsx`

## 2. Danish Translation & Button Copy

- [x] 2.1 Update submit button label to "Log ind" (and "Logger ind..." during submission)
- [x] 2.2 Translate login gate header, subtitle, field labels, and verification loader copy to Danish
- [x] 2.3 Update input focus borders to neutral styling (`focus:border-[#555555]`)

## 3. Verification & Type Checking

- [x] 3.1 Run `npx tsc --noEmit` to verify type safety and error-free build
- [x] 3.2 Verify login modal presentation in browser with blank inputs and "Log ind" button
