export const getLabel = (
    items: { label: string; value: string }[],
    value: string | null
) => {
    return items.find((item) => item.value === value)?.label;
};