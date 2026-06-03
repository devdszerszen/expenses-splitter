const isPL = navigator.language.startsWith('pl')

const en = {
  home: {
    title: 'Expenses Splitter',
    tagline: 'Split expenses, keep friends.',
    newRoom: 'New Room',
    roomName: 'Room name',
    teamAName: 'Team A name',
    teamBName: 'Team B name',
    pin: 'PIN (optional)',
    creating: 'Creating…',
    createRoom: 'Create Room',
    joinRoom: 'Join Room',
    joinPlaceholder: 'Paste room link or ID',
    join: 'Join',
    errorFillFields: 'Please fill in room name and both team names.',
    errorCreate: 'Failed to create room. Check your connection.',
    errorInvalidId: 'Invalid room link or ID.',
  },
  room: {
    loading: 'Loading…',
    notFound: 'Room Not Found',
    goHome: 'Go home',
    shareAriaLabel: 'Share room',
    addAriaLabel: 'Add expense',
  },
  modal: {
    title: 'Add Expense',
    description: 'Description',
    cancel: 'Cancel',
    add: 'Add Expense',
  },
  list: {
    empty: 'No expenses yet. Add one!',
    deleteAriaLabel: 'Delete expense',
  },
  scoreboard: {
    even: 'Even! 🎉',
    owes: ' owes ',
  },
  pin: {
    title: 'Enter PIN',
    error: 'Wrong PIN. Try again.',
    enter: 'Enter',
  },
  sync: {
    synced: 'Synced',
    saving: 'Saving…',
    error: 'Sync error',
  },
  toast: {
    addFail: 'Failed to save expense. Try again.',
    addSuccess: 'Expense added!',
    deleteFail: 'Failed to delete. Try again.',
    deleteSuccess: 'Expense removed.',
  },
  install: {
    prompt: 'Add to your home screen',
    iosInstructions: "Tap Share → 'Add to Home Screen'",
    install: 'Install',
    dismiss: 'Dismiss',
  },
}

const pl: typeof en = {
  home: {
    title: 'Expenses Splitter',
    tagline: 'Dziel wydatki, zachowaj przyjaciół.',
    newRoom: 'Nowy Pokój',
    roomName: 'Nazwa pokoju',
    teamAName: 'Nazwa drużyny A',
    teamBName: 'Nazwa drużyny B',
    pin: 'PIN (opcjonalnie)',
    creating: 'Tworzenie…',
    createRoom: 'Utwórz Pokój',
    joinRoom: 'Dołącz do Pokoju',
    joinPlaceholder: 'Wklej link lub ID pokoju',
    join: 'Dołącz',
    errorFillFields: 'Wypełnij nazwę pokoju i obie drużyny.',
    errorCreate: 'Błąd tworzenia pokoju. Sprawdź połączenie.',
    errorInvalidId: 'Nieprawidłowy link lub ID pokoju.',
  },
  room: {
    loading: 'Ładowanie…',
    notFound: 'Pokój nie znaleziony',
    goHome: 'Strona główna',
    shareAriaLabel: 'Udostępnij pokój',
    addAriaLabel: 'Dodaj wydatek',
  },
  modal: {
    title: 'Dodaj Wydatek',
    description: 'Opis',
    cancel: 'Anuluj',
    add: 'Dodaj Wydatek',
  },
  list: {
    empty: 'Brak wydatków. Dodaj pierwszy!',
    deleteAriaLabel: 'Usuń wydatek',
  },
  scoreboard: {
    even: 'Równo! 🎉',
    owes: ' jest winny ',
  },
  pin: {
    title: 'Wpisz PIN',
    error: 'Błędny PIN. Spróbuj ponownie.',
    enter: 'Wejdź',
  },
  sync: {
    synced: 'Zsynchronizowano',
    saving: 'Zapisywanie…',
    error: 'Błąd synchronizacji',
  },
  toast: {
    addFail: 'Błąd zapisu wydatku. Spróbuj ponownie.',
    addSuccess: 'Wydatek dodany!',
    deleteFail: 'Błąd usuwania. Spróbuj ponownie.',
    deleteSuccess: 'Wydatek usunięty.',
  },
  install: {
    prompt: 'Dodaj do ekranu głównego',
    iosInstructions: "Dotknij Udostępnij → 'Dodaj do ekranu'",
    install: 'Zainstaluj',
    dismiss: 'Odrzuć',
  },
}

export const t = isPL ? pl : en
