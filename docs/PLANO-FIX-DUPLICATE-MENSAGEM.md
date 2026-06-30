# Plano: Correção de Mensagens Duplicadas ao pressionar Enter

## Objetivo

Eliminar o bug onde pressionar Enter no campo de texto produz mensagens duplicadas na tela (usuário + assistente aparecem duas vezes).

## Root Cause

O guard `sendingRef` em `useChat.ts` só bloqueia **chamadas assíncronas sobrepostas** dentro do mesmo tick do event loop. Quando o MSW responde na mesma microtask (ou a API é muito rápida), o ciclo do `sendMessage` completa e reseta `sendingRef.current = false` antes do segundo evento `keydown` disparar:

```
1º keydown (macrotask):
  handleKeyDown → handleSend → sendMessage
    → sendingRef.current = true
    → await chatService.sendMessage(...)
    → setText('')
  macrotask encerra

Microtasks:
  → React flush: re-render, isSending=true
  → continuação await: setMessages, finally: sendingRef.current = false

2º keydown (macrotask):
  → sendingRef.current === false → PROSSEGUE → DUPLICATA!
```

O `disabled` no textarea não resolve por si só porque o estado `isSending` só é commitado após o re-render (microtask), e o segundo keydown é uma nova macrotask.

## Solução: `sendingLockRef` no `MessageInput`

Adicionar um `useRef` local em `MessageInput` que bloqueia `handleSend` **sincronamente**, sem depender de estado React, e só libera após o término efetivo do `onSendMessage`:

```tsx
const sendingLockRef = useRef(false)

function handleSend() {
    const trimmed = text.trim()
    if (!trimmed || sendingLockRef.current) return
    sendingLockRef.current = true
    Promise.resolve(onSendMessage(trimmed)).finally(() => {
        sendingLockRef.current = false
    })
    setText('')
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
        textareaRef.current.focus()
    }
}
```

### Por que `Promise.resolve().finally()`?

- `onSendMessage` é tipado como `(text: string) => void` no `MessageInputProps`
- Na prática recebe `sendMessage` de `useChat` que retorna `Promise<void>`
- `Promise.resolve(onSendMessage(...))` normaliza o retorno: se for `Promise`, usa ela; se for `undefined`, cria uma Promise resolvida
- `.finally()` executa o unlock apenas quando a operação efetivamente terminar

### Defesa em camadas

| Camada | Mecanismo | Timing |
|---|---|---|
| 1ª | `sendingLockRef` (síncrono) | Antes de chamar `onSendMessage` |
| 2ª | `disabled` no `<textarea>` (reativo) | Após re-render com `isSending=true` |
| 3ª | `!disabled` no `handleKeyDown` (reativo) | Após re-render com `isSending=true` |
| 4ª | `sendingRef` no `useChat.sendMessage` (síncrono) | Dentro de `sendMessage` |

Nenhum cenário de Enter rápido ou clique consegue furar essa combinação.

## Arquivos envolvidos

| Arquivo | Alteração |
|---|---|
| `src/components/chat/MessageInput.tsx` | Adicionar `sendingLockRef` + `Promise.resolve().finally()` |
| `docs/PLANO-FIX-DUPLICATE-MENSAGEM.md` | Este plano |

## Teste de verificação

1. Abrir o app no navegador (dev mode com MSW)
2. Digitar "teste" e pressionar Enter rapidamente duas vezes
3. Observar que apenas um par usuário/assistente aparece
4. Repetir o teste clicando no botão de envio rapidamente
5. Repetir o teste com API real (se disponível) para garantir
