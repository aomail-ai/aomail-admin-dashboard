export function formatTokenCount(count: number): string {
    if (isNaN(count) || count === null) {
        return "N/A";
    }

    if (count >= 1_000_000_000) {
        return `${(count / 1_000_000_000).toFixed(1)}B`;
    } else if (count >= 1_000_000) {
        return `${(count / 1_000_000).toFixed(1)}M`;
    } else if (count >= 1_000) {
        return count.toLocaleString();
    } else {
        return count.toString();
    }
}

export function formatCost(cost: number): string {
    if (isNaN(cost) || cost === null) {
        return "N/A";
    }

    if (cost >= 1_000_000_000) {
        return `$${(cost / 1_000_000_000).toFixed(2)}B`;
    } else if (cost >= 1_000_000) {
        return `$${(cost / 1_000_000).toFixed(2)}M`;
    } else if (cost >= 1_000) {
        return `$${(cost / 1_000).toFixed(2)}K`;
    } else {
        return `$${cost.toFixed(2)}`;
    }
}
