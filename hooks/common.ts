import { useEffect, useReducer, useState } from "react";

export type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

export function useAsyncState<T>(
  initialValue: [boolean, T | null] = [true, null],
): UseStateHook<T> {
  return useReducer(
    (state: [boolean, T | null], action: T | null = null): [boolean, T | null] => [false, action],
    initialValue
  ) as UseStateHook<T>;
}



export function useMessageState() {
    const [hideSubtitle, setHideSubtitle] = useState(true);
    const [selected, setSelected] = useState(false);

    function handleToggleSubtitle() {
        setHideSubtitle(!hideSubtitle);
    }

    function handleLongPress() {
        setSelected(!selected);
    }

    const props = {
        hideSubtitle,
        onPress: handleToggleSubtitle,
        // onLongPress: handleToggleSubtitle,
    }

    return props
}

