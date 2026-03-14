---
run_id: subagent_1773447666105_dgkcvtus
profile: explore
description: "Explore codebase for modals"
cwd: "D:\\HomeWork\\freelance\\vanotest"
agent: ""
lock_key: ""
model: ""
session_id: "488fe134-0eca-40af-9607-fa7cfedecb1d"
isolation: "none"
worktree_path: ""
created_at: 2026-03-14T00:21:38.234Z
---

## Prompt

Explore this project to find:
1. The existing "КОНСУЛЬТАЦИЯ" modal implementation and how it validates phone numbers
2. Any existing modal components or patterns used in this project
3. The project structure (what framework is used: React, Vue, vanilla JS, etc.)
4. Any existing pricing/calculation modals

Give me a clear summary with file paths and the phone validation logic used.

## Output

I'll explore this project systematically to find the modal implementations, phone validation logic, and project structure.

Based on my exploration, here is a clear summary:

## Project Structure
- **Framework**: React 19 + TypeScript with Vite build tool
- **Package.json**: `react: ^19.2.3`, `vite: ^6.2.0`, `typescript: ~5.8.2`
- **Components directory**: `components/` with reusable UI components

## Modal Implementations

### 1. "КОНСУЛЬТАЦИЯ" Modal (App.tsx)
- **Location**: `App.tsx` (lines 186-220)
- **Implementation**: Inline modal using `ContactForm` component with `type="modal"` prop
- **Triggered by**: Header CTA, Hero section buttons, Services section
- **Two modal types**: 'consultation' and 'engineer' (both use same form)
- **Modal pattern**: Fixed positioned overlay with backdrop blur (bg-black/60), z-50, centered content

### 2. Success Modal (components/SuccessModal.tsx)
- **Location**: `components/SuccessModal.tsx`
- **Features**: Auto-close after delay (default 3s), backdrop click closes, smooth animations
- **Props**: `isOpen`, `onClose`, `title`, `message`, `autoCloseDelay`

## Phone Validation Logic
**Location**: `components/ContactForm.tsx` (lines 11-15)

```typescript
const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^(\+7|8)[\s-]?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}
```

**Validation details**:
- Accepts Russian numbers starting with `+7` or `8`
- Supports formats: `+7 (920) 123-45-67`, `8-920-123-45-67`, `89201234567`, etc.
- Also sanitizes input in `handlePhoneChange` (line 49-57) to only allow digits, spaces, dashes, plus, parentheses
- Maximum length: 20 characters
- Error messages: "Пожалуйста, введите корректный номер (8-920-123-45-67)"

**Additional validation** (full form validation, lines 60-82):
- Required field
- Minimum length checks
- Combined with name and service validation

## Pricing/Calculation Modals
- **Quiz component** (`components/Quiz.tsx`) is the closest to a pricing modal
  - 3-step interactive questionnaire (service type, property type, timeline)
  - Collects user answers but **does not perform actual price calculations**
  - Final step is a contact form to "receive calculation and discount"
- **No dynamic pricing calculation** exists; pricing shown in case studies (`constants.tsx`) are static example prices
- The quiz promises "3 варианта сметы (Бюджет / Стандарт / Премиум)" but this is marketing text only, not implemented

## Modal Pattern Consistency
Both modals share:
- Backdrop: `fixed inset-0 bg-black/60 backdrop-blur-sm` with `onClick` to close
- Modal container: `bg-white rounded-3xl`, centered with `flex items-center justify-center`
- Scroll lock: `document.body.style.overflow = 'hidden'` when any modal is open (App.tsx lines 98-106)
- Accessibility: `aria-label`, `aria-busy`, proper button sizing (min-h-[44px])
- Animation: `animate-in zoom-in duration-300`

The phone validation is centralized in ContactForm and used by both modal and main form variants via the `type` prop.
