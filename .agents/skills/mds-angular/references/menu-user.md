# Menu User

## Description
Specifically designed menu item displaying the authenticated user's profile actions, such as Logout or Profile Settings.

## When to Apply
Use this component when:
- Top bar user dropdown navigation
- Profile-specific actions in sidebars

Do NOT use this component when:
- System-level navigations not related to standard user profiles (e.g., app features)

## API Reference (Inputs/Outputs)

### Inputs
| Input | Tipo | Descrição |
|-------|------|-----------|
| `active` | `any` | Item ativo |
| `avatarAutoVariant` | `any` | Habilita variant automática de acordo com a letra inicial |
| `avatarVariant` | `any` | Variante do avatar |
| `compact` | `any` | Define se o componente exibe apenas o avatar |
| `descricao` | `any` | Descrição do Usuário |
| `infoBadge` | `any` | Informação do badge |
| `localImage` | `any` | Imagem do avatar |
| `name` | `any` | Nome do Usuário |
| `notify` | `any` | Possui noticifação |
| `notifyVariant` | `any` | Variante do badge |
| `responsive` | `any` | Habilita a detecção de responsividade |

## Code Examples

### HTML Template
```html
<mds-menu-user [userProfile]="user()" (logout)="performLogout()"></mds-menu-user>
```

### TypeScript Component
```typescript
user = signal({ name: 'Admin User', avatar: 'user.png' });
```
